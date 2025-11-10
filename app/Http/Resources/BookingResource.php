<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'yachtId' => $this->yacht_id,
            'userId' => $this->user_id,
            'startDate' => $this->start_date?->toISOString(),
            'endDate' => $this->end_date?->toISOString(),
            'totalPrice' => $this->total_price,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),

            // Relationships
            'yacht' => $this->whenLoaded('yacht', function () {
                return new YachtResource($this->yacht);
            }),

            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),

            'review' => $this->whenLoaded('review', function () {
                return $this->review ? new ReviewResource($this->review) : null;
            }),

            // Computed properties
            'durationWeeks' => $this->when(
                isset($this->start_date) && isset($this->end_date),
                fn () => $this->start_date->diffInWeeks($this->end_date)
            ),

            'isCompleted' => $this->status === 'completed',
            'isConfirmed' => $this->status === 'confirmed',
            'isPending' => $this->status === 'pending',
            'isCancelled' => $this->status === 'cancelled',
        ];
    }
}
