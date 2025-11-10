<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'yachtId' => $this->yacht?->id,
            'bookingId' => $this->booking_id,
            'userId' => $this->user?->id,
            'ownerId' => $this->owner?->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            // Relationships
            'yacht' => $this->whenLoaded('booking', function () {
                return $this->booking?->yacht ? new YachtResource($this->booking->yacht) : null;
            }),

            'booking' => $this->whenLoaded('booking', function () {
                return new BookingResource($this->booking);
            }),

            'user' => $this->whenLoaded('booking', function () {
                return $this->booking?->user ? new UserResource($this->booking->user) : null;
            }),

            // Computed properties
            'canEdit' => $this->when(
                $request->user(),
                fn () => $request->user()->id === $this->user?->id &&
                $this->created_at->diffInHours(now()) < 24
            ),
        ];
    }
}
