<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the chat detail page', function () {
    $this->get('/chats/chat')->assertRedirect(route('login'));
});

it('renders the chat detail page for verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/chats/chat')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('chats/chat'));
});
