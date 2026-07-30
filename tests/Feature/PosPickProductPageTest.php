<?php

use App\Models\Business;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the POS product picker', function () {
    $this->get('/pos')->assertRedirect(route('login'));
});

it('renders the POS product picker for verified users', function () {
    $business = Business::create([
        'code' => 'POS-PICKER',
        'name' => 'POS Picker',
        'business_type' => 'store',
        'owner_name' => 'Owner',
        'address' => 'Surabaya',
    ]);

    $this->actingAs(User::factory()->create(['business_id' => $business->id, 'role' => 'store']))
        ->get('/pos')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('pos/pick-product'));
});

it('renders the POS checkout confirmation for verified users', function () {
    $business = Business::create([
        'code' => 'POS-CHECKOUT',
        'name' => 'POS Checkout',
        'business_type' => 'store',
        'owner_name' => 'Owner',
        'address' => 'Surabaya',
    ]);

    $this->actingAs(User::factory()->create(['business_id' => $business->id, 'role' => 'store']))
        ->get(route('pos.checkout'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component(
                'pos/checkout-confirmation',
            ),
        );
});

it('redirects guests from the POS checkout notification', function () {
    $this->get(route('pos.notification', 1))->assertRedirect(route('login'));
});

it('renders the POS checkout notification for verified users', function () {
    $business = Business::create([
        'code' => 'POS-NOTIFICATION',
        'name' => 'POS Notification',
        'business_type' => 'store',
        'owner_name' => 'Owner',
        'address' => 'Surabaya',
    ]);
    $user = User::factory()->create(['business_id' => $business->id, 'role' => 'store']);
    $sale = Sale::create([
        'business_id' => $business->id,
        'user_id' => $user->id,
        'invoice_number' => 'POS-PAGE-TEST',
        'total_amount' => 0,
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('pos.notification', $sale))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component(
                'pos/checkout-notification',
            ),
        );
});
