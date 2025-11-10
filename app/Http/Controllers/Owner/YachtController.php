<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreYachtRequest;
use App\Http\Requests\UpdateYachtRequest;
use App\Http\Resources\YachtResource;
use App\Models\Yacht;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class YachtController extends Controller
{
    /**
     * Display a listing of the owner's yachts.
     */
    public function index(): Response
    {
        $yachts = auth()->user()
            ->yachts()
            ->with(['primaryImage', 'images', 'bookings', 'reviews'])
            ->latest()
            ->paginate(12);

        return Inertia::render('my-yachts/index', [
            'yachts' => YachtResource::collection($yachts),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Yacht::class);

        return Inertia::render('my-yachts/create');
    }

    /**
     * Store a newly created yacht in storage.
     */
    public function store(StoreYachtRequest $request): RedirectResponse
    {
        $yacht = Yacht::create([...$request->validated(), 'user_id' => auth()->id()]);

        // Handle image uploads if present
        if ($request->hasFile('images')) {
            $this->handleImageUploads($yacht, $request->file('images'));
        }

        return redirect()
            ->route('my-yachts.index')
            ->with('success', 'Yacht created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Yacht $yacht): Response
    {
        Gate::authorize('view', $yacht);

        $yacht->load([
            'owner',
            'images',
            'primaryImage',
            'pricings',
            'bookings.user',
            'reviews.booking.user',
        ]);

        return Inertia::render('my-yachts/show', [
            'yacht' => new YachtResource($yacht),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Yacht $yacht): Response
    {
        Gate::authorize('update', $yacht);

        $yacht->load(['images', 'primaryImage', 'pricings']);

        return Inertia::render('my-yachts/edit', [
            'yacht' => new YachtResource($yacht),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateYachtRequest $request, Yacht $yacht): RedirectResponse
    {
        $yacht->update($request->validated());

        // Handle image uploads if present
        if ($request->hasFile('images')) {
            $this->handleImageUploads($yacht, $request->file('images'));
        }

        // Handle image deletions if present
        if ($request->has('delete_images')) {
            $this->handleImageDeletions($yacht, $request->input('delete_images'));
        }

        return redirect()
            ->route('my-yachts.show', $yacht)
            ->with('success', 'Yacht updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Yacht $yacht): RedirectResponse
    {
        Gate::authorize('delete', $yacht);

        // Delete all images
        foreach ($yacht->images as $image) {
            \Storage::delete($image->path);
            $image->delete();
        }

        $yacht->delete();

        return redirect()
            ->route('my-yachts.index')
            ->with('success', 'Yacht deleted successfully!');
    }

    /**
     * Handle image uploads for a yacht.
     */
    protected function handleImageUploads(Yacht $yacht, array $images): void
    {
        $isFirst = $yacht->images()->count() === 0;

        foreach ($images as $index => $image) {
            $path = $image->store('yachts', 'public');

            $yacht->images()->create([
                'path' => $path,
                'is_primary' => $isFirst && $index === 0,
            ]);
        }
    }

    /**
     * Handle image deletions for a yacht.
     */
    protected function handleImageDeletions(Yacht $yacht, array $imageIds): void
    {
        $images = $yacht->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            \Storage::delete($image->path);
            $image->delete();
        }

        // Ensure there's still a primary image
        if ($yacht->images()->where('is_primary', true)->count() === 0) {
            $firstImage = $yacht->images()->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }
    }

    /**
     * Store a new pricing period for a yacht.
     */
    public function storePricing(Request $request, Yacht $yacht): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'price_per_week' => 'required|numeric|min:0',
        ]);

        $yacht->pricings()->create($validated);

        return redirect()->back()->with('success', 'Pricing period added successfully');
    }

    /**
     * Update a pricing period.
     */
    public function updatePricing(Request $request, Yacht $yacht, int $pricingId): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $pricing = $yacht->pricings()->findOrFail($pricingId);

        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'price_per_week' => 'required|numeric|min:0',
        ]);

        $pricing->update($validated);

        return redirect()->back()->with('success', 'Pricing period updated successfully');
    }

    /**
     * Delete a pricing period.
     */
    public function destroyPricing(Yacht $yacht, int $pricingId): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $pricing = $yacht->pricings()->findOrFail($pricingId);
        $pricing->delete();

        return redirect()->back()->with('success', 'Pricing period deleted successfully');
    }

    /**
     * Upload new images for a yacht.
     */
    public function storeImages(Request $request, Yacht $yacht): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $validated = $request->validate([
            'images' => ['required', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB max per image
        ]);

        $currentCount = $yacht->images()->count();
        $newCount = count($validated['images']);

        if ($currentCount + $newCount > 10) {
            return redirect()->back()->withErrors([
                'images' => 'Cannot upload more than 10 images total. You have ' . $currentCount . ' images.',
            ]);
        }

        $this->handleImageUploads($yacht, $validated['images']);

        return redirect()->back()->with('success', 'Images uploaded successfully!');
    }

    /**
     * Delete a yacht image.
     */
    public function destroyImage(Yacht $yacht, int $imageId): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $image = $yacht->images()->findOrFail($imageId);

        // Delete file from storage
        \Storage::disk('public')->delete($image->path);

        // Delete database record
        $image->delete();

        // If this was the primary image, set another one as primary
        if ($image->is_primary) {
            $firstImage = $yacht->images()->first();
            if ($firstImage) {
                $firstImage->update(['is_primary' => true]);
            }
        }

        return redirect()->back()->with('success', 'Image deleted successfully!');
    }

    /**
     * Set an image as primary.
     */
    public function setPrimaryImage(Yacht $yacht, int $imageId): RedirectResponse
    {
        Gate::authorize('update', $yacht);

        $image = $yacht->images()->findOrFail($imageId);

        // Remove primary flag from all images
        $yacht->images()->update(['is_primary' => false]);

        // Set this image as primary
        $image->update(['is_primary' => true]);

        return redirect()->back()->with('success', 'Primary image updated!');
    }
}
