<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permission::VIEW_OWN_BOOKINGS->value)
            || $user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Admin can view all bookings
        if ($user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value)) {
            return true;
        }

        // User can view their own bookings
        if (
            $user->hasPermissionTo(Permission::VIEW_OWN_BOOKINGS->value)
            && $booking->user_id === $user->id
        ) {
            return true;
        }

        // Yacht owner can view bookings for their yachts
        if (
            $user->hasPermissionTo(Permission::MANAGE_YACHT_BOOKINGS->value)
            && $booking->yacht->user_id === $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::CREATE_BOOKING->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Admin can update any booking
        if ($user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value)) {
            return true;
        }

        // Yacht owner can confirm/reject bookings for their yachts
        if (
            $user->hasPermissionTo(Permission::MANAGE_YACHT_BOOKINGS->value)
            && $booking->yacht->user_id === $user->id
            && $booking->status === 'pending'
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Booking $booking): bool
    {
        // Only admin can delete bookings
        return $user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value);
    }

    /**
     * Determine whether the user can cancel the booking.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        // Admin can cancel any booking
        if ($user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value)) {
            return true;
        }

        // User can cancel their own pending bookings
        if (
            $user->hasPermissionTo(Permission::CANCEL_OWN_BOOKING->value)
            && $booking->user_id === $user->id
            && $booking->status === 'pending'
        ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can confirm the booking.
     */
    public function confirm(User $user, Booking $booking): bool
    {
        // Admin can confirm any booking
        if ($user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value)) {
            return true;
        }

        // Yacht owner can confirm pending bookings for their yachts
        return $user->hasPermissionTo(Permission::MANAGE_YACHT_BOOKINGS->value)
            && $booking->yacht->user_id === $user->id
            && $booking->status === 'pending';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Booking $booking): bool
    {
        return $user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Booking $booking): bool
    {
        return $user->hasPermissionTo(Permission::VIEW_ALL_BOOKINGS->value);
    }
}
