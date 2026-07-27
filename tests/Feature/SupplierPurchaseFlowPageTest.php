<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the supplier product page', function () {
    $this->get('/suppliers/buy-product')->assertRedirect(route('login'));
});

it('renders the supplier product page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/suppliers/buy-product')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('suppliers/buy-product'));
});

it('redirects guests from the supplier checkout confirmation page', function () {
    $this->get('/suppliers/checkout-confirmation')->assertRedirect(route('login'));
});

it('renders the supplier checkout confirmation page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/suppliers/checkout-confirmation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('suppliers/checkout-confirmation'));
});

it('redirects guests from the supplier checkout notification page', function () {
    $this->get('/suppliers/checkout-notification')->assertRedirect(route('login'));
});

it('renders the supplier checkout notification page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/suppliers/checkout-notification')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('suppliers/checkout-notification'));
});
