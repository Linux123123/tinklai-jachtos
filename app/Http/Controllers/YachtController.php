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
        $yachts = \Spatie\QueryBuilder\QueryBuilder::for(Yacht::class)
            ->allowedFilters([
                'type',
                'manufacturer',
                'model',
                \Spatie\QueryBuilder\AllowedFilter::exact('year'),
                \Spatie\QueryBuilder\AllowedFilter::scope('price_range'), // We might need to implement this scope or filter
                \Spatie\QueryBuilder\AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('title', 'like', "%{$value}%")
                            ->orWhere('location', 'like', "%{$value}%")
                            ->orWhere('manufacturer', 'like', "%{$value}%")
                            ->orWhere('model', 'like', "%{$value}%");
                    });
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('capacity', function ($query, $value) {
                    $query->where('capacity', '>=', $value);
                }),
            ])
            ->allowedSorts([
                'year',
                'created_at',
                'reviews_avg_rating',
                \Spatie\QueryBuilder\AllowedSort::callback('price', function ($query, $descending) {
                    $direction = $descending ? 'desc' : 'asc';
                    $query->orderByRaw('(SELECT MIN(price_per_week) FROM pricings WHERE pricings.yacht_id = yachts.id) ' . $direction);
                }),
            ])
            ->defaultSort('-created_at')
            ->with(['primaryImage', 'owner', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('status', 'available');

        $yachts = $yachts->paginate(12)->withQueryString();

        $manufacturers = Yacht::distinct()->whereNotNull('manufacturer')->pluck('manufacturer')->sort()->values();

        // Get manufacturer-model mapping for dependent filtering
        $manufacturerModels = Yacht::whereNotNull('manufacturer')
            ->whereNotNull('model')
            ->select('manufacturer', 'model')
            ->distinct()
            ->get()
            ->groupBy('manufacturer')
            ->map(fn ($items) => $items->pluck('model')->sort()->values())
            ->toArray();

        $years = Yacht::distinct()->whereNotNull('year')->pluck('year')->sortDesc()->values();
        $capacities = Yacht::distinct()->whereNotNull('capacity')->pluck('capacity')->sort()->values();

        return Inertia::render('yachts/index', [
            'yachts' => YachtResource::collection($yachts),
            'filters' => $request->all(),
            'manufacturers' => $manufacturers,
            'manufacturerModels' => $manufacturerModels,
            'years' => $years,
            'capacities' => $capacities,
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
