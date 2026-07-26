<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the transaction history page', function () {
    $this->get('/transactions/history')->assertRedirect(route('login'));
});

it('renders the transaction history page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/transactions/history')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('transactions/history'));
});
