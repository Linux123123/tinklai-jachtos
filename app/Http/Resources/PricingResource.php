<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingResource extends JsonResource
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
            'startDate' => $this->start_date->toISOString(),
            'endDate' => $this->end_date->toISOString(),
            'pricePerWeek' => $this->price_per_week,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            // Relationships
            'yacht' => $this->whenLoaded('yacht', function () {
                return new YachtResource($this->yacht);
            }),
        ];
    }
}
