<?php

use App\Models\User;

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('home'))->assertOk();
});
