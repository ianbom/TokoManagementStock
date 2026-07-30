<?php

use App\Models\Business;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the chat detail page', function () {
    $this->get('/chats/1')->assertRedirect(route('login'));
});

it('renders messages from the selected conversation', function () {
    $store = Business::query()->create(['code' => 'STORE-001', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $supplier = Business::query()->create(['code' => 'SUP-001', 'name' => 'Supplier Asli', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Sidoarjo']);
    $user = User::factory()->create(['business_id' => $store->id]);
    $supplierUser = User::factory()->create(['business_id' => $supplier->id]);
    $conversation = Conversation::query()->create(['business_one_id' => $store->id, 'business_two_id' => $supplier->id, 'last_message_at' => now()]);
    Message::query()->create(['conversation_id' => $conversation->id, 'sender_business_id' => $supplier->id, 'sender_user_id' => $supplierUser->id, 'message' => 'Pesan dari database']);

    $this->actingAs($user)
        ->get("/chats/{$conversation->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('chats/chat')
            ->where('partner.name', 'Supplier Asli')
            ->has('messages', 1)
            ->where('messages.0.message', 'Pesan dari database')
            ->where('messages.0.sent_by_me', false));
});

it('hides conversations owned by another business', function () {
    $store = Business::query()->create(['code' => 'STORE-001', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $otherStore = Business::query()->create(['code' => 'STORE-002', 'name' => 'Toko Lain', 'business_type' => 'store', 'owner_name' => 'Pemilik Lain', 'address' => 'Sidoarjo']);
    $supplier = Business::query()->create(['code' => 'SUP-001', 'name' => 'Supplier Asli', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Gresik']);
    $conversation = Conversation::query()->create(['business_one_id' => $otherStore->id, 'business_two_id' => $supplier->id]);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->get("/chats/{$conversation->id}")
        ->assertNotFound();
});

it('sends a text message and updates the conversation timestamp', function () {
    [$store, $supplier, $user, $conversation] = chatMessageContext('TEXT');

    $response = $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", ['message' => 'Stok barang tersedia']);

    $message = Message::query()->sole();

    $response->assertRedirect(route('chats.show', $conversation));
    expect($message->sender_business_id)->toBe($store->id)
        ->and($message->sender_user_id)->toBe($user->id)
        ->and($message->message)->toBe('Stok barang tersedia')
        ->and($message->media)->toBeNull()
        ->and($message->media_type)->toBeNull()
        ->and($conversation->fresh()->last_message_at)->not->toBeNull();
});

it('sends an image without a caption', function () {
    Storage::fake('public');
    [, , $user, $conversation] = chatMessageContext('IMAGE');

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", [
            'media' => UploadedFile::fake()->image('produk.jpg')->size(5000),
        ])
        ->assertRedirect(route('chats.show', $conversation));

    $message = Message::query()->sole();

    expect($message->message)->toBeNull()
        ->and($message->media_type)->toBe('image')
        ->and($message->media)->not->toBeNull();
    Storage::disk('public')->assertExists($message->media);
});

it('sends a video with an optional caption', function () {
    Storage::fake('public');
    [, , $user, $conversation] = chatMessageContext('VIDEO');

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", [
            'message' => 'Video produk terbaru',
            'media' => UploadedFile::fake()->create('produk.mp4', 25000, 'video/mp4'),
        ])
        ->assertRedirect(route('chats.show', $conversation));

    $message = Message::query()->sole();

    expect($message->message)->toBe('Video produk terbaru')
        ->and($message->media_type)->toBe('video');
    Storage::disk('public')->assertExists($message->media);
});

it('validates empty, unsupported, and oversized chat messages', function () {
    Storage::fake('public');
    [, , $user, $conversation] = chatMessageContext('VALIDATION');

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages")
        ->assertSessionHasErrors(['message']);

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", [
            'media' => UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors(['media']);

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", [
            'media' => UploadedFile::fake()->image('besar.jpg')->size(5121),
        ])
        ->assertSessionHasErrors(['media']);

    $this->actingAs($user)
        ->post("/chats/{$conversation->id}/messages", [
            'media' => UploadedFile::fake()->create('besar.mp4', 25601, 'video/mp4'),
        ])
        ->assertSessionHasErrors(['media']);

    expect(Message::query()->count())->toBe(0);
});

it('prevents outsiders from sending messages', function () {
    Storage::fake('public');
    [, , , $conversation] = chatMessageContext('OUTSIDER');
    $outsider = Business::query()->create(['code' => 'OUTSIDER', 'name' => 'Toko Luar', 'business_type' => 'store', 'owner_name' => 'Pemilik Luar', 'address' => 'Malang']);

    $this->actingAs(User::factory()->create(['business_id' => $outsider->id]))
        ->post("/chats/{$conversation->id}/messages", ['message' => 'Pesan ilegal'])
        ->assertForbidden();

    expect(Message::query()->count())->toBe(0);
});

it('renders media and marks incoming messages as read', function () {
    Storage::fake('public');
    [$store, $supplier, $user, $conversation] = chatMessageContext('READ');
    $supplierUser = User::factory()->create(['business_id' => $supplier->id]);
    Storage::disk('public')->put("messages/{$conversation->id}/photo.jpg", 'image');
    $message = Message::query()->create([
        'conversation_id' => $conversation->id,
        'sender_business_id' => $supplier->id,
        'sender_user_id' => $supplierUser->id,
        'message' => 'Foto stok',
        'media' => "messages/{$conversation->id}/photo.jpg",
        'media_type' => 'image',
    ]);

    $this->actingAs($user)
        ->get("/chats/{$conversation->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('messages.0.media_type', 'image')
            ->where('messages.0.media_url', Storage::disk('public')->url($message->media)));

    expect($message->fresh()->read_at)->not->toBeNull()
        ->and($message->fresh()->sender_business_id)->toBe($supplier->id)
        ->and($store->id)->not->toBe($supplier->id);
});

/** @return array{Business, Business, User, Conversation} */
function chatMessageContext(string $suffix): array
{
    $store = Business::query()->create(['code' => "STORE-{$suffix}", 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $supplier = Business::query()->create(['code' => "SUP-{$suffix}", 'name' => 'Supplier Asli', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Sidoarjo']);
    $user = User::factory()->create(['business_id' => $store->id]);
    $conversation = Conversation::query()->create(['business_one_id' => $store->id, 'business_two_id' => $supplier->id]);

    return [$store, $supplier, $user, $conversation];
}
