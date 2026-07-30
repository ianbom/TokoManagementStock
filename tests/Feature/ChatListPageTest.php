<?php

use App\Models\Business;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the chat list page', function () {
    $this->get('/chats')->assertRedirect(route('login'));
});

it('renders the chat list page for verified users', function () {
    $store = Business::query()->create(['code' => 'STORE-001', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $supplier = Business::query()->create(['code' => 'SUP-001', 'name' => 'Lumintu Grosir', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Sidoarjo']);
    $user = User::factory()->create(['business_id' => $store->id]);
    $supplierUser = User::factory()->create(['business_id' => $supplier->id]);
    $conversation = Conversation::query()->create(['business_one_id' => $store->id, 'business_two_id' => $supplier->id, 'last_message_at' => now()]);
    Message::query()->create(['conversation_id' => $conversation->id, 'sender_business_id' => $supplier->id, 'sender_user_id' => $supplierUser->id, 'message' => 'Stok minyak sudah tersedia']);

    $this->actingAs($user)
        ->get('/chats?search=minyak')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('chats/list-chat')
            ->where('filters.search', 'minyak')
            ->has('conversations.data', 1)
            ->where('conversations.data.0.partner.name', 'Lumintu Grosir')
            ->where('conversations.data.0.latest_message', 'Stok minyak sudah tersedia')
            ->where('conversations.data.0.unread_count', 1));

    $this->actingAs($user)
        ->get('/chats?search=Lumintu')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('conversations.data', 1)
            ->where('conversations.data.0.partner.name', 'Lumintu Grosir'));
});

it('searches chat partners and excludes the active business', function () {
    $store = Business::query()->create(['code' => 'STORE-SEARCH', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    Business::query()->create(['code' => 'STORE-PARTNER', 'name' => 'Toko Lumintu', 'business_type' => 'store', 'owner_name' => 'Pemilik Mitra', 'address' => 'Sidoarjo']);
    Business::query()->create(['code' => 'SUP-PARTNER', 'name' => 'Supplier Lumintu', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Gresik']);
    Business::query()->create(['code' => 'STORE-OTHER', 'name' => 'Toko Berbeda', 'business_type' => 'store', 'owner_name' => 'Pemilik Lain', 'address' => 'Malang']);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->getJson('/chats/partners?search=Lumintu')
        ->assertOk()
        ->assertJsonCount(2, 'partners')
        ->assertJsonPath('partners.0.name', 'Supplier Lumintu')
        ->assertJsonPath('partners.1.name', 'Toko Lumintu')
        ->assertJsonMissing(['name' => 'Toko Utama']);
});

it('starts a conversation with canonical business ordering', function () {
    $partner = Business::query()->create(['code' => 'PARTNER-FIRST', 'name' => 'Mitra Pertama', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Mitra', 'address' => 'Gresik']);
    $store = Business::query()->create(['code' => 'STORE-SECOND', 'name' => 'Toko Kedua', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $user = User::factory()->create(['business_id' => $store->id]);

    $response = $this->actingAs($user)->post("/chats/{$partner->id}/start");
    $conversation = Conversation::query()->sole();

    $response->assertRedirect(route('chats.show', $conversation));
    expect($conversation->business_one_id)->toBe($partner->id)
        ->and($conversation->business_two_id)->toBe($store->id);
});

it('reuses active conversations and restores deleted conversations', function () {
    $store = Business::query()->create(['code' => 'STORE-REUSE', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $partner = Business::query()->create(['code' => 'PARTNER-REUSE', 'name' => 'Mitra Lama', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Mitra', 'address' => 'Gresik']);
    $user = User::factory()->create(['business_id' => $store->id]);
    [$businessOneId, $businessTwoId] = collect([$store->id, $partner->id])->sort()->values()->all();
    $conversation = Conversation::query()->create(['business_one_id' => $businessOneId, 'business_two_id' => $businessTwoId]);

    $this->actingAs($user)
        ->post("/chats/{$partner->id}/start")
        ->assertRedirect(route('chats.show', $conversation));

    expect(Conversation::query()->count())->toBe(1);

    $conversation->delete();

    $this->actingAs($user)
        ->post("/chats/{$partner->id}/start")
        ->assertRedirect(route('chats.show', $conversation));

    expect($conversation->fresh())->not->toBeNull()
        ->and(Conversation::withTrashed()->count())->toBe(1);
});

it('rejects starting a conversation with the active business', function () {
    $store = Business::query()->create(['code' => 'STORE-SELF', 'name' => 'Toko Sendiri', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->post("/chats/{$store->id}/start")
        ->assertForbidden();
});
