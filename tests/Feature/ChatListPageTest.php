<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the chat list page', function () {
    $this->get('/chats')->assertRedirect(route('login'));
});

it('renders the chat list page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/chats')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('chats/list-chat'));
});
