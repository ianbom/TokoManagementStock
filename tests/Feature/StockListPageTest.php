<?php

use App\Models\Business;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the stock list page', function () {
    $this->get('/stocks')->assertRedirect(route('login'));
});

it('renders the stock list page for verified users', function () {
    $store = Business::query()->create(['code' => 'STORE-001', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $otherStore = Business::query()->create(['code' => 'STORE-002', 'name' => 'Toko Lain', 'business_type' => 'store', 'owner_name' => 'Pemilik Lain', 'address' => 'Sidoarjo']);
    Product::query()->create(['business_id' => $store->id, 'name' => 'Produk Milik Toko', 'stock' => 8, 'purchase_price' => 10000, 'selling_price' => 12000]);
    Product::query()->create(['business_id' => $otherStore->id, 'name' => 'Produk Toko Lain', 'stock' => 20, 'purchase_price' => 15000, 'selling_price' => 18000]);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->get('/stocks')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('stocks/list-stock')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Produk Milik Toko')
            ->where('summary.total_products', 1)
            ->where('summary.total_stock', 8)
            ->where('summary.low_stock', 1));
});

it('redirects guests when updating a stock product', function () {
    $product = stockListProduct(stockListBusiness());

    $this->patch("/stocks/{$product->id}", [])->assertRedirect(route('login'));
});

it('prevents users from updating another business product', function () {
    $store = stockListBusiness();
    $otherStore = stockListBusiness();
    $product = stockListProduct($otherStore);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->patch("/stocks/{$product->id}", [
            'name' => 'Produk Diubah',
            'stock' => 10,
            'purchase_price' => 1000,
            'selling_price' => 1500,
        ])
        ->assertForbidden();

    expect($product->refresh()->name)->not->toBe('Produk Diubah');
});

it('validates stock product updates', function () {
    $store = stockListBusiness();
    $product = stockListProduct($store);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->from(route('stocks.index'))
        ->patch("/stocks/{$product->id}", [
            'name' => '',
            'stock' => -1,
            'purchase_price' => -1,
            'selling_price' => -1,
            'image' => UploadedFile::fake()->create('product.pdf', 10, 'application/pdf'),
        ])
        ->assertRedirect(route('stocks.index'))
        ->assertSessionHasErrors(['name', 'stock', 'purchase_price', 'selling_price', 'image']);
});

it('updates product data and records a stock increase', function () {
    Storage::fake('public');
    Storage::disk('public')->put('products/1/old.png', 'old image');
    $store = stockListBusiness();
    $user = User::factory()->create(['business_id' => $store->id]);
    $product = stockListProduct($store, [
        'name' => 'Produk Lama',
        'stock' => 8,
        'purchase_price' => 1000,
        'selling_price' => 1500,
        'image' => 'products/1/old.png',
    ]);

    $this->actingAs($user)
        ->patch("/stocks/{$product->id}", [
            'name' => 'Produk Baru',
            'stock' => 13,
            'purchase_price' => 2000,
            'selling_price' => 3000,
            'image' => UploadedFile::fake()->image('new.png'),
        ])
        ->assertRedirect();

    $product->refresh();

    expect($product)
        ->name->toBe('Produk Baru')
        ->stock->toBe(13)
        ->purchase_price->toBe('2000.00')
        ->selling_price->toBe('3000.00')
        ->image->not->toBeNull();
    Storage::disk('public')->assertMissing('products/1/old.png');
    Storage::disk('public')->assertExists($product->image);

    $movement = StockMovement::query()->sole();

    expect($movement)
        ->business_id->toBe($store->id)
        ->product_id->toBe($product->id)
        ->user_id->toBe($user->id)
        ->movement_type->toBe('stock_in')
        ->source->toBe('manual_input')
        ->quantity->toBe(5)
        ->stock_before->toBe(8)
        ->stock_after->toBe(13);
});

it('records a stock decrease and skips movements when stock is unchanged', function () {
    $store = stockListBusiness();
    $user = User::factory()->create(['business_id' => $store->id]);
    $product = stockListProduct($store, [
        'stock' => 8,
        'purchase_price' => 1000,
        'selling_price' => 1500,
    ]);

    $this->actingAs($user)->patch("/stocks/{$product->id}", [
        'name' => $product->name,
        'stock' => 3,
        'purchase_price' => 1000,
        'selling_price' => 1500,
    ])->assertRedirect();

    $movement = StockMovement::query()->sole();

    expect($movement)
        ->movement_type->toBe('stock_out')
        ->quantity->toBe(5)
        ->stock_before->toBe(8)
        ->stock_after->toBe(3);

    $this->actingAs($user)->patch("/stocks/{$product->id}", [
        'name' => 'Nama Baru',
        'stock' => 3,
        'purchase_price' => 1200,
        'selling_price' => 1800,
    ])->assertRedirect();

    expect(StockMovement::query()->count())->toBe(1);
});

it('keeps an old image still referenced by another product', function () {
    Storage::fake('public');
    Storage::disk('public')->put('products/shared.png', 'shared image');
    $store = stockListBusiness();
    $otherStore = stockListBusiness();
    $user = User::factory()->create(['business_id' => $store->id]);
    $product = stockListProduct($store, ['image' => 'products/shared.png']);
    stockListProduct($otherStore, ['image' => 'products/shared.png']);

    $this->actingAs($user)->post("/stocks/{$product->id}", [
        '_method' => 'patch',
        'name' => $product->name,
        'stock' => $product->stock,
        'purchase_price' => $product->purchase_price,
        'selling_price' => $product->selling_price,
        'image' => UploadedFile::fake()->image('replacement.png'),
    ])->assertRedirect();

    Storage::disk('public')->assertExists('products/shared.png');
});

function stockListBusiness(): Business
{
    static $sequence = 0;
    $sequence++;

    return Business::query()->create([
        'code' => "STORE-EDIT-{$sequence}",
        'name' => "Toko Edit {$sequence}",
        'business_type' => 'store',
        'owner_name' => 'Pemilik Toko',
        'address' => 'Surabaya',
    ]);
}

/** @param array<string, mixed> $attributes */
function stockListProduct(Business $business, array $attributes = []): Product
{
    return Product::query()->create(array_merge([
        'business_id' => $business->id,
        'name' => 'Produk Uji',
        'stock' => 5,
        'purchase_price' => 1000,
        'selling_price' => 1500,
    ], $attributes));
}
