<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the POS product picker', function () {
    $this->get('/pos')->assertRedirect(route('login'));
});

it('renders the POS product picker for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/pos')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('pos/pick-product'));
});

it('renders the POS checkout confirmation for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('pos.checkout'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component(
                'pos/checkout-confirmation',
            ),
        );
});

it('redirects guests from the POS checkout notification', function () {
    $this->get(route('pos.notification'))->assertRedirect(route('login'));
});

it('renders the POS checkout notification for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('pos.notification'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component(
                'pos/checkout-notification',
            ),
        );
});
