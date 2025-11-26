<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Yacht;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class YachtFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_filter_yachts_by_manufacturer()
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create();

        Yacht::create([
            'user_id' => $user->id,
            'title' => 'Beneteau Yacht',
            'description' => 'Description',
            'type' => 'sailboat',
            'capacity' => 6,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Beneteau',
            'model' => 'Oceanis',
            'year' => 2022,
        ]);

        Yacht::create([
            'user_id' => $user->id,
            'title' => 'Azimut Yacht',
            'description' => 'Description',
            'type' => 'motorboat',
            'capacity' => 8,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Azimut',
            'model' => 'Flybridge',
            'year' => 2023,
        ]);

        $response = $this->get('/?filter[manufacturer]=Beneteau');

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('yachts/index')
                ->has('yachts.data', 1)
                ->where('yachts.data.0.manufacturer', 'Beneteau')
        );
    }

    public function test_can_filter_yachts_by_year()
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create();

        Yacht::create([
            'user_id' => $user->id,
            'title' => '2022 Yacht',
            'description' => 'Description',
            'type' => 'sailboat',
            'capacity' => 6,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Beneteau',
            'model' => 'Oceanis',
            'year' => 2022,
        ]);

        Yacht::create([
            'user_id' => $user->id,
            'title' => '2023 Yacht',
            'description' => 'Description',
            'type' => 'motorboat',
            'capacity' => 8,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Azimut',
            'model' => 'Flybridge',
            'year' => 2023,
        ]);

        $response = $this->get('/?filter[year]=2022');

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('yachts/index')
                ->has('yachts.data', 1)
                ->where('yachts.data.0.year', 2022)
        );
    }

    public function test_can_filter_yachts_by_model()
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create();

        Yacht::create([
            'user_id' => $user->id,
            'title' => 'Oceanis Yacht',
            'description' => 'Description',
            'type' => 'sailboat',
            'capacity' => 6,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Beneteau',
            'model' => 'Oceanis',
            'year' => 2022,
        ]);

        Yacht::create([
            'user_id' => $user->id,
            'title' => 'Flybridge Yacht',
            'description' => 'Description',
            'type' => 'motorboat',
            'capacity' => 8,
            'location' => 'Miami',
            'status' => 'available',
            'manufacturer' => 'Azimut',
            'model' => 'Flybridge',
            'year' => 2023,
        ]);

        $response = $this->get('/?filter[model]=Oceanis');

        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('yachts/index')
                ->has('yachts.data', 1)
                ->where('yachts.data.0.model', 'Oceanis')
        );
    }
}
