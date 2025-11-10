<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
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
            'conversationId' => $this->conversation_id,
            'senderId' => $this->sender_id,
            'body' => $this->body,
            'readAt' => $this->read_at?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),

            // Relationships
            'conversation' => $this->whenLoaded('conversation', function () {
                return new ConversationResource($this->conversation);
            }),

            'sender' => $this->whenLoaded('sender', function () {
                return new UserResource($this->sender);
            }),

            // Computed properties
            'isRead' => !is_null($this->read_at),
            'isMine' => $this->when(
                $request->user(),
                fn () => $request->user()->id === $this->sender_id
            ),
        ];
    }
}
