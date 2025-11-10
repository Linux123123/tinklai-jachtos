<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        // Everyone can view reviews, even guests
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Review $review): bool
    {
        // Everyone can view reviews, even guests
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::CREATE_REVIEW->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Review $review): bool
    {
        // Admin can update any review
        if ($user->hasPermissionTo(Permission::MANAGE_ALL_REVIEWS->value)) {
            return true;
        }

        // User can only update their own reviews within 24 hours
        if ($review->user_id === $user->id) {
            return $review->created_at->diffInHours(now()) < 24;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Review $review): bool
    {
        // Admin can delete any review
        if ($user->hasPermissionTo(Permission::MANAGE_ALL_REVIEWS->value)) {
            return true;
        }

        // User can delete their own review
        return $user->hasPermissionTo(Permission::DELETE_OWN_REVIEW->value)
            && $review->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Review $review): bool
    {
        return $user->hasPermissionTo(Permission::MANAGE_ALL_REVIEWS->value);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Review $review): bool
    {
        return $user->hasPermissionTo(Permission::MANAGE_ALL_REVIEWS->value);
    }
}
