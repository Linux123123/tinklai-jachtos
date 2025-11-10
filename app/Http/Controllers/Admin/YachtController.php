<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\YachtResource;
use App\Models\Yacht;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YachtController extends Controller
{
    /**
     * Display a listing of all yachts.
     */
    public function index(Request $request): Response
    {
        $query = Yacht::query()
            ->with(['owner', 'primaryImage', 'images'])
            ->withCount(['bookings', 'reviews']);

        // Search by title or location
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by owner
        if ($request->filled('owner_id')) {
            $query->where('user_id', $request->input('owner_id'));
        }

        $yachts = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/yachts/index', [
            'yachts' => YachtResource::collection($yachts),
            'filters' => $request->only(['search', 'status', 'type', 'owner_id']),
        ]);
    }

    /**
     * Display the specified yacht.
     */
    public function show(Yacht $yacht): Response
    {
        $yacht->load([
            'owner',
            'images',
            'primaryImage',
            'pricings',
            'bookings.user',
            'reviews.booking.user',
        ]);

        return Inertia::render('admin/yachts/show', [
            'yacht' => YachtResource::make($yacht),
        ]);
    }

    /**
     * Show the form for editing the specified yacht.
     */
    public function edit(Yacht $yacht): Response
    {
        $yacht->load(['owner', 'images', 'pricings']);

        return Inertia::render('admin/yachts/edit', [
            'yacht' => YachtResource::make($yacht),
        ]);
    }

    /**
     * Update the specified yacht in storage.
     */
    public function update(Request $request, Yacht $yacht): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'string', 'in:sailboat,motorboat,catamaran,yacht'],
            'capacity' => ['required', 'integer', 'min:1'],
            'location' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:available,unavailable,under_maintenance'],
        ]);

        $yacht->update($validated);

        return redirect()
            ->route('admin.yachts.index')
            ->with('success', 'Jachta sėkmingai atnaujinta!');
    }

    /**
     * Remove the specified yacht from storage.
     */
    public function destroy(Yacht $yacht): RedirectResponse
    {
        // Check if yacht has active bookings
        $activeBookings = $yacht->bookings()
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        if ($activeBookings > 0) {
            return back()->withErrors([
                'error' => 'Negalima ištrinti jachtos, turinčios aktyvių rezervacijų. Pirmiausia atšaukite arba užbaikite visas rezervacijas.',
            ]);
        }

        // Delete associated images
        foreach ($yacht->images as $image) {
            // Delete the image file from storage
            if (\Storage::exists($image->path)) {
                \Storage::delete($image->path);
            }
            $image->delete();
        }

        $yacht->delete();

        return redirect()
            ->route('admin.yachts.index')
            ->with('success', 'Jachta sėkmingai ištrinta!');
    }

    /**
     * Update yacht status.
     */
    public function updateStatus(Request $request, Yacht $yacht): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:available,unavailable,under_maintenance'],
        ]);

        $yacht->update(['status' => $validated['status']]);

        return back()->with('success', 'Jachtos būsena sėkmingai atnaujinta!');
    }
}
