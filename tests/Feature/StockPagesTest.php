<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests away from stock-in pages', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'confirmation' => 'stocks.confirmation',
    'notification' => 'stocks.notification',
]);

it('allows authenticated users to visit stock-in pages', function (string $routeName, string $component) {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    'confirmation' => ['stocks.confirmation', 'stocks/stock-in-confirmation'],
    'notification' => ['stocks.notification', 'stocks/stock-in-notification'],
]);
