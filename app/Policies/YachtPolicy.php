<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\User;
use App\Models\Yacht;

class YachtPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        // Everyone can view yachts, even guests
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Yacht $yacht): bool
    {
        // Everyone can view individual yachts, even guests
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::CREATE_YACHT->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Yacht $yacht): bool
    {
        // Admin can update any yacht
        if ($user->hasPermissionTo(Permission::MANAGE_ALL_YACHTS->value)) {
            return true;
        }

        // Owner can only update their own yachts
        return $user->hasPermissionTo(Permission::UPDATE_OWN_YACHT->value)
            && $yacht->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Yacht $yacht): bool
    {
        // Admin can delete any yacht
        if ($user->hasPermissionTo(Permission::MANAGE_ALL_YACHTS->value)) {
            return true;
        }

        // Owner can only delete their own yachts (if no active bookings)
        if (
            $user->hasPermissionTo(Permission::DELETE_OWN_YACHT->value)
            && $yacht->user_id === $user->id
        ) {
            // Check if yacht has active or pending bookings
            $hasActiveBookings = $yacht->bookings()
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            return !$hasActiveBookings;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Yacht $yacht): bool
    {
        return $user->hasPermissionTo(Permission::MANAGE_ALL_YACHTS->value);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Yacht $yacht): bool
    {
        return $user->hasPermissionTo(Permission::MANAGE_ALL_YACHTS->value);
    }

    /**
     * Determine whether the user can manage pricing for the yacht.
     */
    public function managePricing(User $user, Yacht $yacht): bool
    {
        // Admin can manage any yacht's pricing
        if ($user->hasPermissionTo(Permission::MANAGE_ALL_YACHTS->value)) {
            return true;
        }

        // Owner can only manage pricing for their own yachts
        return $user->hasPermissionTo(Permission::MANAGE_OWN_YACHT_PRICING->value)
            && $yacht->user_id === $user->id;
    }

    /**
     * Determine whether the user can manage bookings for the yacht.
     */
    public function manageBookings(User $user, Yacht $yacht): bool
    {
        // Admin can manage all bookings
        if ($user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value)) {
            return true;
        }

        // Owner can manage bookings for their own yachts
        return $user->hasPermissionTo(Permission::MANAGE_YACHT_BOOKINGS->value)
            && $yacht->user_id === $user->id;
    }
}
