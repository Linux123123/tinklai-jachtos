<?php

namespace App\Enums;

/**
 * Role enum.
 *
 * Defines all available roles in the system
 */
enum Role: string
{
    case CLIENT = 'client';
    case OWNER = 'owner';
    case ADMIN = 'admin';

    /**
     * Get all role values as array.
     */
    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * Get role label for display.
     */
    public function label(): string
    {
        return match ($this) {
            self::CLIENT => 'Client',
            self::OWNER => 'Owner',
            self::ADMIN => 'Administrator',
        };
    }

    /**
     * Get role description.
     */
    public function description(): string
    {
        return match ($this) {
            self::CLIENT => 'Can browse yachts, make bookings, send messages, and leave reviews',
            self::OWNER => 'All client permissions + can list yachts, manage pricing, and handle bookings',
            self::ADMIN => 'Full system access, user management, and view statistics',
        };
    }
}
