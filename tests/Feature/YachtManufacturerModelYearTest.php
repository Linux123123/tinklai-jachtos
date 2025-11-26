<?php

use App\Models\User;
use App\Models\Yacht;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('owner can create yacht with manufacturer, model and year', function () {
    $owner = User::factory()->create();
    $owner->assignRole('owner');

    $response = $this->actingAs($owner)->post('/my-yachts', [
        'title' => 'Test Yacht',
        'description' => 'A beautiful test yacht',
        'type' => 'sailboat',
        'capacity' => 6,
        'location' => 'Klaipėda',
        'manufacturer' => 'Bavaria',
        'model' => 'Cruiser 46',
        'year' => 2022,
    ]);

    $response->assertRedirect('/my-yachts');

    $this->assertDatabaseHas('yachts', [
        'title' => 'Test Yacht',
        'manufacturer' => 'Bavaria',
        'model' => 'Cruiser 46',
        'year' => 2022,
    ]);
});

test('owner can update yacht with manufacturer, model and year', function () {
    $owner = User::factory()->create();
    $owner->assignRole('owner');

    $yacht = Yacht::create([
        'user_id' => $owner->id,
        'title' => 'Original Yacht',
        'description' => 'Original description',
        'type' => 'sailboat',
        'capacity' => 6,
        'location' => 'Nida',
        'status' => 'available',
        'manufacturer' => 'Old Manufacturer',
        'model' => 'Old Model',
        'year' => 2020,
    ]);

    $response = $this->actingAs($owner)->put("/my-yachts/{$yacht->id}", [
        'title' => 'Updated Yacht',
        'description' => 'Updated description',
        'type' => 'motorboat',
        'capacity' => 8,
        'location' => 'Klaipėda',
        'status' => 'available',
        'manufacturer' => 'Beneteau',
        'model' => 'Oceanis 51.1',
        'year' => 2023,
    ]);

    $response->assertRedirect("/my-yachts/{$yacht->id}");

    $this->assertDatabaseHas('yachts', [
        'id' => $yacht->id,
        'title' => 'Updated Yacht',
        'manufacturer' => 'Beneteau',
        'model' => 'Oceanis 51.1',
        'year' => 2023,
    ]);
});

test('yacht manufacturer, model and year are optional', function () {
    $owner = User::factory()->create();
    $owner->assignRole('owner');

    $response = $this->actingAs($owner)->post('/my-yachts', [
        'title' => 'Test Yacht Without Optional Fields',
        'description' => 'A yacht without manufacturer, model and year',
        'type' => 'catamaran',
        'capacity' => 10,
        'location' => 'Palanga',
    ]);

    $response->assertRedirect('/my-yachts');

    $this->assertDatabaseHas('yachts', [
        'title' => 'Test Yacht Without Optional Fields',
        'manufacturer' => null,
        'model' => null,
        'year' => null,
    ]);
});

test('yacht year validation rejects invalid year', function () {
    $owner = User::factory()->create();
    $owner->assignRole('owner');

    $response = $this->actingAs($owner)->post('/my-yachts', [
        'title' => 'Test Yacht',
        'description' => 'A yacht with invalid year',
        'type' => 'yacht',
        'capacity' => 4,
        'location' => 'Klaipėda',
        'year' => 1800, // Too old
    ]);

    $response->assertSessionHasErrors('year');
});

test('yacht year validation rejects future year beyond limit', function () {
    $owner = User::factory()->create();
    $owner->assignRole('owner');

    $response = $this->actingAs($owner)->post('/my-yachts', [
        'title' => 'Test Yacht',
        'description' => 'A yacht with future year',
        'type' => 'yacht',
        'capacity' => 4,
        'location' => 'Klaipėda',
        'year' => date('Y') + 5, // Too far in the future
    ]);

    $response->assertSessionHasErrors('year');
});

test('admin can update yacht with manufacturer, model and year', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $owner = User::factory()->create();

    $yacht = Yacht::create([
        'user_id' => $owner->id,
        'title' => 'Admin Test Yacht',
        'description' => 'A yacht for admin testing',
        'type' => 'sailboat',
        'capacity' => 6,
        'location' => 'Šventoji',
        'status' => 'available',
        'manufacturer' => 'Original',
        'model' => 'Original Model',
        'year' => 2021,
    ]);

    $response = $this->actingAs($admin)->put("/admin/yachts/{$yacht->id}", [
        'title' => 'Admin Updated Yacht',
        'description' => 'Updated by admin',
        'type' => 'motorboat',
        'capacity' => 10,
        'location' => 'Klaipėda',
        'status' => 'available',
        'manufacturer' => 'Azimut',
        'model' => 'S7',
        'year' => 2024,
    ]);

    $response->assertRedirect(route('admin.yachts.index'));

    $this->assertDatabaseHas('yachts', [
        'id' => $yacht->id,
        'manufacturer' => 'Azimut',
        'model' => 'S7',
        'year' => 2024,
    ]);
});

test('yacht show page displays manufacturer, model and year', function () {
    $owner = User::factory()->create();

    $yacht = Yacht::create([
        'user_id' => $owner->id,
        'title' => 'Display Test Yacht',
        'description' => 'Testing display of specs',
        'type' => 'sailboat',
        'capacity' => 8,
        'location' => 'Nida',
        'status' => 'available',
        'manufacturer' => 'Jeanneau',
        'model' => 'Sun Odyssey 440',
        'year' => 2022,
    ]);

    $response = $this->get("/yachts/{$yacht->id}");

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('yachts/show')
            ->where('yacht.manufacturer', 'Jeanneau')
            ->where('yacht.model', 'Sun Odyssey 440')
            ->where('yacht.year', 2022)
    );
});
