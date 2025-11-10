<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
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
            'participantOneId' => $this->participant_one_id,
            'participantTwoId' => $this->participant_two_id,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            // Relationships
            'yacht' => $this->whenLoaded('yacht', function () {
                return new YachtResource($this->yacht);
            }),

            'participantOne' => $this->whenLoaded('participantOne', function () {
                return new UserResource($this->participantOne);
            }),

            'participantTwo' => $this->whenLoaded('participantTwo', function () {
                return new UserResource($this->participantTwo);
            }),

            'messages' => $this->whenLoaded('messages', function () {
                return MessageResource::collection($this->messages);
            }),

            // Computed properties
            'lastMessage' => $this->when(
                $this->relationLoaded('messages'),
                fn () => $this->messages->last() ? new MessageResource($this->messages->last()) : null
            ),

            'unreadCount' => $this->when(
                $request->user() && $this->relationLoaded('messages'),
                fn () => $this->messages->where('user_id', '!=', $request->user()->id)
                    ->where('read_at', null)
                    ->count()
            ),
        ];
    }
}
