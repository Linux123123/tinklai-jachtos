<?php

namespace App\Http\Controllers;

use App\Http\Resources\YachtResource;
use App\Models\Yacht;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YachtController extends Controller
{
    /**
     * Display a listing of available yachts.
     */
    public function index(Request $request): Response
    {
        $query = Yacht::query()
            ->with(['primaryImage', 'owner', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'available');

        // Search by title or location
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by capacity
        if ($request->filled('capacity')) {
            $query->where('capacity', '>=', $request->input('capacity'));
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->input('location') . '%');
        }

        // Sort
        $sortBy = $request->input('sortBy', 'latest');
        match ($sortBy) {
            'price_low' => $query->leftJoin('pricings', 'yachts.id', '=', 'pricings.yacht_id')
                ->selectRaw('yachts.*, MIN(pricings.price_per_week) as min_price')
                ->groupBy('yachts.id')
                ->orderBy('min_price', 'asc'),
            'price_high' => $query->leftJoin('pricings', 'yachts.id', '=', 'pricings.yacht_id')
                ->selectRaw('yachts.*, MAX(pricings.price_per_week) as max_price')
                ->groupBy('yachts.id')
                ->orderByDesc('max_price'),
            'rating' => $query->orderByDesc('reviews_avg_rating'),
            default => $query->latest(),
        };

        $yachts = $query->paginate(12)->withQueryString();

        return Inertia::render('yachts/index', [
            'yachts' => YachtResource::collection($yachts),
            'filters' => $request->only(['search', 'type', 'capacity', 'location', 'sortBy']),
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
            'pricings' => fn ($query) => $query->orderBy('start_date'),
            'reviews.booking.user',
            'reviews.booking.yacht',
            'bookings' => fn ($query) => $query->where('status', '!=', 'cancelled'),
        ]);

        return Inertia::render('yachts/show', [
            'yacht' => new YachtResource($yacht),
        ]);
    }
}
