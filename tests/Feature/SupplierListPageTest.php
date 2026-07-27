<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the supplier list page', function () {
    $this->get('/suppliers')->assertRedirect(route('login'));
});

it('renders the supplier list page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/suppliers')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('suppliers/list-supplier'));
});
