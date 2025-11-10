<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Review;
use App\Notifications\NewReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Show the form for creating a new review.
     */
    public function create(Booking $booking): Response
    {
        // Check if user can leave a review for this booking
        if ($booking->user_id !== auth()->id()) {
            abort(403, 'Galite vertinti tik savo rezervacijas.');
        }

        if ($booking->status !== 'completed') {
            abort(403, 'Galite vertinti tik užbaigtas rezervacijas.');
        }

        if ($booking->review()->exists()) {
            abort(403, 'Jau esate palikę atsiliepimą apie šią rezervaciją.');
        }

        $booking->load(['yacht.primaryImage', 'yacht.owner']);

        return Inertia::render('reviews/create', [
            'booking' => $booking,
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(StoreReviewRequest $request, Booking $booking): RedirectResponse
    {
        // Check if user can leave a review for this booking
        if ($booking->user_id !== auth()->id()) {
            abort(403, 'Galite vertinti tik savo rezervacijas.');
        }

        if ($booking->status !== 'completed') {
            return back()->withErrors(['error' => 'Galite vertinti tik užbaigtas rezervacijas.']);
        }

        if ($booking->review()->exists()) {
            return back()->withErrors(['error' => 'Jau esate palikę atsiliepimą apie šią rezervaciją.']);
        }

        $review = Review::create([
            'booking_id' => $booking->id,
            'rating' => $request->validated('rating'),
            'comment' => $request->validated('comment'),
        ]);

        // Notify yacht owner
        $booking->yacht->owner->notify(new NewReview($review));

        return redirect()
            ->route('yachts.show', $booking->yacht_id)
            ->with('success', 'Dėkojame už jūsų atsiliepimą!');
    }

    /**
     * Display the specified review.
     */
    public function show(Review $review): Response
    {
        Gate::authorize('view', $review);

        $review->load(['user', 'yacht.primaryImage', 'owner', 'booking']);

        return Inertia::render('reviews/show', [
            'review' => ReviewResource::make($review),
        ]);
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Review $review): RedirectResponse
    {
        Gate::authorize('delete', $review);

        $yachtId = $review->yacht_id;
        $review->delete();

        return redirect()
            ->route('yachts.show', $yachtId)
            ->with('success', 'Atsiliepimas sėkmingai ištrintas.');
    }
}
