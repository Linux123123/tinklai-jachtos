<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class YachtResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'capacity' => $this->capacity,
            'location' => $this->location,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'owner' => $this->whenLoaded('owner', function () {
                return new UserResource($this->owner);
            }),

            'images' => $this->whenLoaded('images', function () {
                return YachtImageResource::collection($this->images);
            }),

            'primaryImage' => $this->whenLoaded('primaryImage', function () {
                return $this->primaryImage ? new YachtImageResource($this->primaryImage) : null;
            }),

            'pricings' => $this->whenLoaded('pricings', function () {
                return PricingResource::collection($this->pricings);
            }),

            'bookings' => $this->whenLoaded('bookings', function () {
                return BookingResource::collection($this->bookings);
            }),

            'reviews' => $this->whenLoaded('reviews', function () {
                return ReviewResource::collection($this->reviews);
            }),

            // Computed properties
            'averageRating' => $this->when(
                $this->relationLoaded('reviews'),
                fn () => round($this->reviews->avg('rating') ?? 0, 1)
            ),

            'reviewsCount' => $this->when(
                $this->relationLoaded('reviews'),
                fn () => $this->reviews->count()
            ),
        ];
    }
}
