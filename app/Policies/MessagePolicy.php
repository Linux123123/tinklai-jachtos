<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permission::VIEW_OWN_MESSAGES->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Message $message): bool
    {
        // User can view messages in conversations they're part of
        $conversation = $message->conversation;

        return $user->hasPermissionTo(Permission::VIEW_OWN_MESSAGES->value)
            && ($conversation->participant_one_id === $user->id
                || $conversation->participant_two_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::SEND_MESSAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Message $message): bool
    {
        // Messages cannot be updated, only deleted
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Message $message): bool
    {
        // User can only delete their own messages
        return $user->hasPermissionTo(Permission::DELETE_OWN_MESSAGE->value)
            && $message->sender_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Message $message): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Message $message): bool
    {
        return $user->hasPermissionTo(Permission::DELETE_OWN_MESSAGE->value)
            && $message->sender_id === $user->id;
    }
}
