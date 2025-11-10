<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Notifications\BookingConfirmed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings for owner's yachts.
     */
    public function index(): Response
    {
        $bookings = Booking::query()
            ->whereHas('yacht', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->with(['yacht.primaryImage', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('owner/bookings/index', [
            'bookings' => BookingResource::collection($bookings),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking): Response
    {
        Gate::authorize('view', $booking);

        $booking->load(['yacht.primaryImage', 'yacht.owner', 'user']);

        return Inertia::render('owner/bookings/show', [
            'booking' => BookingResource::make($booking),
        ]);
    }

    /**
     * Confirm a pending booking.
     */
    public function confirm(Booking $booking): RedirectResponse
    {
        Gate::authorize('update', $booking);

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Patvirtinti galima tik laukiančias rezervacijas.');
        }

        $booking->update(['status' => 'confirmed']);

        // Notify the guest
        $booking->user->notify(new BookingConfirmed($booking));

        return back()->with('success', 'Rezervacija sėkmingai patvirtinta.');
    }

    /**
     * Reject a pending booking.
     */
    public function reject(Booking $booking): RedirectResponse
    {
        Gate::authorize('update', $booking);

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Atmesti galima tik laukiančias rezervacijas.');
        }

        $booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Rezervacija atmesta.');
    }

    /**
     * Mark a confirmed booking as completed.
     */
    public function complete(Booking $booking): RedirectResponse
    {
        Gate::authorize('update', $booking);

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Užbaigti galima tik patvirtintas rezervacijas.');
        }

        // Check if the booking end date has passed (optional validation)
        // if (now()->lt($booking->end_date)) {
        //     return back()->with('error', 'Cannot complete a booking before its end date.');
        // }

        $booking->update(['status' => 'completed']);

        return back()->with('success', 'Rezervacija pažymėta kaip užbaigta.');
    }
}
