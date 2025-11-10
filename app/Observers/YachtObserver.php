<?php

namespace App\Observers;

use App\Enums\Role;
use App\Models\Yacht;

class YachtObserver
{
    /**
     * Handle the Yacht "created" event.
     *
     * Automatically assign the owner role to users who create their first yacht.
     */
    public function created(Yacht $yacht): void
    {
        $user = $yacht->owner;

        // Check if user doesn't have owner role yet
        if ($user && !$user->hasRole(Role::OWNER->value)) {
            // Assign owner role when user creates their first yacht
            $user->assignRole(Role::OWNER->value);

            // Log this event
            \Log::info("User {$user->email} automatically promoted to owner role after creating yacht #{$yacht->id}");
        }
    }

    /**
     * Handle the Yacht "updated" event.
     */
    public function updated(Yacht $yacht): void
    {

    }

    /**
     * Handle the Yacht "deleted" event.
     */
    public function deleted(Yacht $yacht): void
    {

    }

    /**
     * Handle the Yacht "restored" event.
     */
    public function restored(Yacht $yacht): void
    {

    }

    /**
     * Handle the Yacht "force deleted" event.
     */
    public function forceDeleted(Yacht $yacht): void
    {

    }
}
