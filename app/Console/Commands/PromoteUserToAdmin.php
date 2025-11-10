<?php

namespace App\Console\Commands;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Console\Command;

class PromoteUserToAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:promote-admin {email? : The email address of the user to promote}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to admin role';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        // If no email provided, ask for it
        if (!$email) {
            $email = $this->ask('Enter the email address of the user to promote');
        }

        // Find the user
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");

            return self::FAILURE;
        }

        // Check if user already has admin role
        if ($user->hasRole(Role::ADMIN->value)) {
            $this->warn("User '{$user->name}' ({$user->email}) already has the admin role.");

            return self::SUCCESS;
        }

        // Show user info and confirm
        $this->info('User found:');
        $this->table(
            ['ID', 'Name', 'Email', 'Current Roles'],
            [[$user->id, $user->name, $user->email, $user->getRoleNames()->implode(', ') ?: 'None']]
        );

        if (!$this->confirm('Do you want to promote this user to admin?', true)) {
            $this->info('Operation cancelled.');

            return self::SUCCESS;
        }

        // Assign admin role
        $user->assignRole(Role::ADMIN->value);

        $this->info("✅ Successfully promoted '{$user->name}' to admin!");
        $this->info("Current roles: {$user->getRoleNames()->implode(', ')}");

        return self::SUCCESS;
    }
}
