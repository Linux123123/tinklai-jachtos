<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Http\Resources\YachtResource;
use App\Models\Booking;
use App\Models\Yacht;
use App\Notifications\BookingCreated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['yacht.primaryImage', 'yacht.owner', 'review'])
            ->latest()
            ->paginate(10);

        return Inertia::render('my-bookings/index', [
            'bookings' => BookingResource::collection($bookings),
        ]);
    }

    /**
     * Show the form for creating a new booking.
     */
    public function create(Yacht $yacht)
    {
        // Check if yacht is available for booking
        if ($yacht->status !== 'available') {
            return redirect()
                ->route('yachts.show', $yacht->id)
                ->with('error', 'Ši jachta šiuo metu nepasiekiama rezervacijoms.');
        }

        // Load necessary relationships
        $yacht->load([
            'pricings',
            'bookings' => function ($query) {
                $query->whereIn('status', ['pending', 'confirmed'])
                    ->select('id', 'yacht_id', 'start_date', 'end_date');
            },
        ]);

        debug($yacht);

        return Inertia::render('bookings/create', [
            'yacht' => new YachtResource($yacht),
        ]);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request, Yacht $yacht)
    {
        // Check if yacht is available
        if ($yacht->status !== 'available') {
            return back()->with('error', 'Ši jachta nepasiekiama rezervacijoms.');
        }

        // Validate request
        $validated = $request->validate([
            'start_date' => ['required', 'date', 'after:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate);

        // Validate minimum booking period (7 days)
        if ($days < 7) {
            return back()->withErrors([
                'end_date' => 'Minimali rezervacijos trukmė yra 7 dienos.',
            ])->withInput();
        }

        // Check for booking conflicts
        $hasConflict = $yacht->bookings()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();

        if ($hasConflict) {
            return back()->withErrors([
                'start_date' => 'Pasirinktos datos sutampa su kita rezervacija.',
            ])->withInput();
        }

        // Calculate total price
        $totalPrice = $this->calculateTotalPrice($yacht, $startDate, $endDate);

        // Create booking
        $booking = $request->user()->bookings()->create([
            'yacht_id' => $yacht->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        // Notify yacht owner
        $yacht->owner->notify(new BookingCreated($booking));

        return redirect()
            ->route('my-bookings.show', $booking)
            ->with('success', 'Rezervacijos užklausa sėkmingai pateikta!');
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Authorize user can view this booking
        if ($booking->user_id !== auth()->id() && $booking->yacht->user_id !== auth()->id()) {
            abort(403);
        }

        $booking->load(['yacht.primaryImage', 'yacht.owner', 'user', 'review']);

        return Inertia::render('my-bookings/show', [
            'booking' => BookingResource::make($booking),
        ]);
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(Booking $booking)
    {
        // Authorize user can cancel this booking
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if booking can be cancelled
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Ši rezervacija negali būti atšaukta.');
        }

        // Check if start date is in the future
        if (Carbon::parse($booking->start_date)->isPast()) {
            return back()->with('error', 'Negalima atšaukti rezervacijos, kuri jau prasidėjo.');
        }

        $booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Rezervacija sėkmingai atšaukta.');
    }

    /**
     * Calculate total price for a booking period.
     */
    private function calculateTotalPrice(Yacht $yacht, Carbon $startDate, Carbon $endDate): float
    {
        $yacht->load('pricings');
        $totalPrice = 0;
        $currentDate = $startDate->copy();
        $weeks = ceil($startDate->diffInDays($endDate) / 7);

        // Get pricing for the booking period
        $pricings = $yacht->pricings()
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->orderBy('start_date')
            ->get();

        if ($pricings->isEmpty()) {
            // No pricing found - return 0 or throw error
            return 0;
        }

        // Calculate price week by week
        for ($week = 0; $week < $weeks; $week++) {
            $weekStart = $currentDate->copy()->addWeeks($week);
            $weekEnd = $weekStart->copy()->addWeek()->min($endDate);

            // Find applicable pricing for this week
            $applicablePricing = $pricings->first(function ($pricing) use ($weekStart) {
                return Carbon::parse($pricing->start_date)->lte($weekStart)
                    && Carbon::parse($pricing->end_date)->gte($weekStart);
            });

            if ($applicablePricing) {
                $totalPrice += $applicablePricing->price_per_week;
            }
        }

        return $totalPrice;
    }
}
