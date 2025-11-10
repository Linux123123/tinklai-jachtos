<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class YachtImageResource extends JsonResource
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
            'yacht_id' => $this->yacht_id,
            'path' => $this->path,
            'url' => Storage::url($this->path),
            'is_primary' => $this->is_primary,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'yacht' => $this->whenLoaded('yacht', function () {
                return new YachtResource($this->yacht);
            }),
        ];
    }
}
