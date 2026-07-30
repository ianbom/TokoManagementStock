<?php

use App\Models\Business;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the POS checkout confirmation page', function () {
    $this->get('/pos/checkout-confirmation')->assertRedirect(route('login'));
});

it('renders the POS checkout confirmation page for verified users', function () {
    $business = Business::create([
        'code' => 'POS-CONFIRMATION',
        'name' => 'POS Confirmation',
        'business_type' => 'store',
        'owner_name' => 'Owner',
        'address' => 'Surabaya',
    ]);

    $this->actingAs(User::factory()->create(['business_id' => $business->id, 'role' => 'store']))
        ->get('/pos/checkout-confirmation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('pos/checkout-confirmation'));
});
