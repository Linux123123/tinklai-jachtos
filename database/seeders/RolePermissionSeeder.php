<?php

namespace Database\Seeders;

use App\Enums\Permission as PermissionEnum;
use App\Enums\Role as RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all permissions
        $permissions = [];
        foreach (PermissionEnum::cases() as $permissionEnum) {
            $permissions[$permissionEnum->value] = Permission::firstOrCreate([
                'name' => $permissionEnum->value,
                'guard_name' => 'web',
            ]);
        }

        // Create Client role and assign permissions
        $clientRole = Role::firstOrCreate([
            'name' => RoleEnum::CLIENT->value,
            'guard_name' => 'web',
        ]);
        $clientRole->syncPermissions(PermissionEnum::clientPermissions());

        // Create Owner role and assign permissions
        $ownerRole = Role::firstOrCreate([
            'name' => RoleEnum::OWNER->value,
            'guard_name' => 'web',
        ]);
        $ownerRole->syncPermissions(PermissionEnum::ownerPermissions());

        // Create Admin role and assign all permissions
        $adminRole = Role::firstOrCreate([
            'name' => RoleEnum::ADMIN->value,
            'guard_name' => 'web',
        ]);
        $adminRole->syncPermissions(PermissionEnum::adminPermissions());

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('Client role: ' . count(PermissionEnum::clientPermissions()) . ' permissions');
        $this->command->info('Owner role: ' . count(PermissionEnum::ownerPermissions()) . ' permissions');
        $this->command->info('Admin role: ' . count(PermissionEnum::adminPermissions()) . ' permissions');
    }
}
