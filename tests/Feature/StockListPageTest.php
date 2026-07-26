<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the stock list page', function () {
    $this->get('/stocks')->assertRedirect(route('login'));
});

it('renders the stock list page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/stocks')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('stocks/list-stock'));
});
