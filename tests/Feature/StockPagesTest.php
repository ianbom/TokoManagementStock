<?php

use App\Models\Business;
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

it('renders the stock input page for a user with a business', function () {
    $business = Business::create([
        'code' => 'TOKO-0002',
        'name' => 'Toko Sejahtera',
        'business_type' => 'store',
        'owner_name' => 'Siti',
        'address' => 'Bandung',
    ]);
    $user = User::factory()->create(['business_id' => $business->id]);

    $this->actingAs($user)
        ->get(route('stocks.input'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('stocks/input-stock'));
});

it('redirects empty confirmation and notification pages', function (string $routeName, string $redirectRoute) {
    $this->actingAs(User::factory()->create())
        ->get(route($routeName))
        ->assertRedirect(route($redirectRoute));
})->with([
    'confirmation' => ['stocks.confirmation', 'stocks.input'],
    'notification' => ['stocks.notification', 'stocks.index'],
]);
