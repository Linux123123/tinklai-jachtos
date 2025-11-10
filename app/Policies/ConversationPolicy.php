<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
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
    public function view(User $user, Conversation $conversation): bool
    {
        // User can only view conversations they're part of
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
    public function update(User $user, Conversation $conversation): bool
    {
        // Conversations cannot be updated directly
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Conversation $conversation): bool
    {
        // User can delete conversations they're part of
        return $conversation->participant_one_id === $user->id
            || $conversation->participant_two_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Conversation $conversation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Conversation $conversation): bool
    {
        return $conversation->participant_one_id === $user->id
            || $conversation->participant_two_id === $user->id;
    }
}
