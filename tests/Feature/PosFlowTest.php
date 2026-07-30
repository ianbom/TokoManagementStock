<?php

use App\Models\Business;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createPosBusiness(string $code = 'TOKO-TEST'): Business
{
    return Business::create([
        'code' => $code,
        'name' => "Business {$code}",
        'business_type' => 'store',
        'owner_name' => 'Owner Test',
        'address' => 'Surabaya',
    ]);
}

function createPosUser(Business $business): User
{
    return User::factory()->create([
        'business_id' => $business->id,
        'role' => 'store',
    ]);
}

function createPosProduct(Business $business, array $attributes = []): Product
{
    return Product::create([
        'business_id' => $business->id,
        'name' => 'Indomie Goreng',
        'stock' => 10,
        'purchase_price' => 2500,
        'selling_price' => 3500,
        ...$attributes,
    ]);
}

it('requires a business to access POS', function () {
    $this->actingAs(User::factory()->create())
        ->get('/pos')
        ->assertForbidden();
});

it('searches products only inside the active business', function () {
    $business = createPosBusiness();
    $otherBusiness = createPosBusiness('TOKO-OTHER');
    $user = createPosUser($business);
    createPosProduct($business);
    createPosProduct($business, ['name' => 'Aqua 600 ml']);
    createPosProduct($otherBusiness, ['name' => 'Indomie Milik Toko Lain']);

    $this->actingAs($user)
        ->get('/pos?search=Indomie')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/pick-product')
            ->where('filters.search', 'Indomie')
            ->has('products', 1)
            ->where('products.0.name', 'Indomie Goreng'));
});

it('adds updates and removes a cart item in the database session', function () {
    $business = createPosBusiness();
    $user = createPosUser($business);
    $product = createPosProduct($business);
    $sessionKey = "pos.cart.{$business->id}";

    $this->actingAs($user)
        ->post('/pos/cart', ['product_id' => $product->id, 'quantity' => 2])
        ->assertRedirect()
        ->assertSessionHas($sessionKey, [(string) $product->id => 2]);

    $this->actingAs($user)
        ->withSession([$sessionKey => [(string) $product->id => 2]])
        ->patch("/pos/cart/{$product->id}", ['quantity' => 4])
        ->assertRedirect()
        ->assertSessionHas($sessionKey, [(string) $product->id => 4]);

    $this->actingAs($user)
        ->withSession([$sessionKey => [(string) $product->id => 4]])
        ->delete("/pos/cart/{$product->id}")
        ->assertRedirect()
        ->assertSessionHas($sessionKey, []);
});

it('rejects products outside the active business and quantities above stock', function () {
    $business = createPosBusiness();
    $otherBusiness = createPosBusiness('TOKO-OTHER');
    $user = createPosUser($business);
    $otherProduct = createPosProduct($otherBusiness);
    $ownProduct = createPosProduct($business, ['name' => 'Aqua', 'stock' => 2]);

    $this->actingAs($user)
        ->post('/pos/cart', ['product_id' => $otherProduct->id, 'quantity' => 1])
        ->assertSessionHasErrors('product_id');

    $this->actingAs($user)
        ->post('/pos/cart', ['product_id' => $ownProduct->id, 'quantity' => 3])
        ->assertSessionHasErrors('quantity');
});

it('renders checkout from the server cart', function () {
    $business = createPosBusiness();
    $user = createPosUser($business);
    $product = createPosProduct($business);

    $this->actingAs($user)
        ->withSession(["pos.cart.{$business->id}" => [(string) $product->id => 2]])
        ->get('/pos/checkout-confirmation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pos/checkout-confirmation')
            ->has('cart.items', 1)
            ->where('cart.item_count', 2)
            ->where('cart.total', 7000));
});

it('completes a sale and records stock movements atomically', function () {
    $business = createPosBusiness();
    $user = createPosUser($business);
    $product = createPosProduct($business, ['stock' => 10]);
    $sessionKey = "pos.cart.{$business->id}";

    $response = $this->actingAs($user)
        ->withSession([$sessionKey => [(string) $product->id => 2]])
        ->post('/pos/checkout', [
            'customer_name' => 'Budi',
            'notes' => 'Bayar tunai',
        ]);

    $sale = Sale::query()->sole();

    $response->assertRedirect(route('pos.notification', $sale));
    expect($sale->status)->toBe('completed')
        ->and((float) $sale->total_amount)->toBe(7000.0)
        ->and($sale->customer_name)->toBe('Budi')
        ->and($sale->items()->count())->toBe(1)
        ->and($product->fresh()->stock)->toBe(8)
        ->and(StockMovement::query()->where('sale_id', $sale->id)->count())->toBe(1);

    $response->assertSessionHas($sessionKey, []);
});

it('rolls back checkout when stock changed after adding to cart', function () {
    $business = createPosBusiness();
    $user = createPosUser($business);
    $product = createPosProduct($business, ['stock' => 1]);
    $sessionKey = "pos.cart.{$business->id}";

    $this->actingAs($user)
        ->withSession([$sessionKey => [(string) $product->id => 2]])
        ->post('/pos/checkout', [])
        ->assertSessionHasErrors('cart');

    expect(Sale::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and($product->fresh()->stock)->toBe(1);
});

it('prevents another business from viewing a completed sale', function () {
    $business = createPosBusiness();
    $otherBusiness = createPosBusiness('TOKO-OTHER');
    $user = createPosUser($business);
    $otherUser = createPosUser($otherBusiness);
    $sale = Sale::create([
        'business_id' => $business->id,
        'user_id' => $user->id,
        'invoice_number' => 'INV-TEST',
        'status' => 'completed',
        'total_amount' => 0,
        'completed_at' => now(),
    ]);

    $this->actingAs($otherUser)
        ->get("/pos/checkout-notification/{$sale->id}")
        ->assertForbidden();
});
