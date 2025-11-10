<?php

namespace App\Enums;

/**
 * Permission enum.
 *
 * Defines all available permissions in the system
 */
enum Permission: string
{
    // Yacht permissions
    case VIEW_YACHTS = 'view yachts';
    case CREATE_YACHT = 'create yacht';
    case UPDATE_OWN_YACHT = 'update own yacht';
    case DELETE_OWN_YACHT = 'delete own yacht';
    case MANAGE_ALL_YACHTS = 'manage all yachts'; // Admin only

    // Booking permissions
    case CREATE_BOOKING = 'create booking';
    case VIEW_OWN_BOOKINGS = 'view own bookings';
    case CANCEL_OWN_BOOKING = 'cancel own booking';
    case MANAGE_YACHT_BOOKINGS = 'manage yacht bookings'; // Owner can manage bookings for their yachts
    case VIEW_ALL_BOOKINGS = 'view all bookings'; // Admin only

    // Review permissions
    case CREATE_REVIEW = 'create review';
    case VIEW_REVIEWS = 'view reviews';
    case DELETE_OWN_REVIEW = 'delete own review';
    case MANAGE_ALL_REVIEWS = 'manage all reviews'; // Admin only

    // Messaging permissions
    case SEND_MESSAGE = 'send message';
    case VIEW_OWN_MESSAGES = 'view own messages';
    case DELETE_OWN_MESSAGE = 'delete own message';

    // Pricing permissions
    case MANAGE_OWN_YACHT_PRICING = 'manage own yacht pricing';

    // User management permissions (Admin only)
    case VIEW_ALL_USERS = 'view all users';
    case MANAGE_USERS = 'manage users';
    case ASSIGN_ROLES = 'assign roles';

    // Statistics permissions (Admin only)
    case VIEW_STATISTICS = 'view statistics';

    /**
     * Get all permission values as array.
     */
    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * Get permissions for client role.
     */
    public static function clientPermissions(): array
    {
        return [
            self::VIEW_YACHTS->value,
            self::CREATE_YACHT->value, // Clients can create yachts (and become owners)
            self::CREATE_BOOKING->value,
            self::VIEW_OWN_BOOKINGS->value,
            self::CANCEL_OWN_BOOKING->value,
            self::CREATE_REVIEW->value,
            self::VIEW_REVIEWS->value,
            self::DELETE_OWN_REVIEW->value,
            self::SEND_MESSAGE->value,
            self::VIEW_OWN_MESSAGES->value,
            self::DELETE_OWN_MESSAGE->value,
        ];
    }

    /**
     * Get permissions for owner role.
     */
    public static function ownerPermissions(): array
    {
        return array_merge(self::clientPermissions(), [
            self::UPDATE_OWN_YACHT->value,
            self::DELETE_OWN_YACHT->value,
            self::MANAGE_YACHT_BOOKINGS->value,
            self::MANAGE_OWN_YACHT_PRICING->value,
        ]);
    }

    /**
     * Get permissions for admin role.
     */
    public static function adminPermissions(): array
    {
        return self::values();
    }
}
