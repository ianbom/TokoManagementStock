<?php

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function stockInUser(): User
{
    $business = Business::create([
        'code' => 'TOKO-0001',
        'name' => 'Toko Makmur',
        'business_type' => 'store',
        'owner_name' => 'Budi',
        'address' => 'Jakarta',
    ]);

    return User::factory()->create([
        'business_id' => $business->id,
        'role' => 'store',
    ]);
}

it('adds a product to the session draft without writing inventory', function () {
    $user = stockInUser();

    $this->actingAs($user)
        ->post(route('stocks.draft.store'), [
            'name' => 'Indomie Goreng',
            'purchase_price' => 3000,
            'selling_price' => 3500,
            'quantity' => 50,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('stocks.confirmation'))
        ->assertSessionHas('stock_in.draft', function (array $items): bool {
            return count($items) === 1
                && $items[0]['name'] === 'Indomie Goreng'
                && $items[0]['quantity'] === 50;
        });

    $this->assertDatabaseCount('products', 0);
    $this->assertDatabaseCount('stock_movements', 0);
});

it('merges repeated products in the same draft', function () {
    $user = stockInUser();

    $this->actingAs($user)->post(route('stocks.draft.store'), [
        'name' => 'Indomie Goreng',
        'purchase_price' => 3000,
        'selling_price' => 3500,
        'quantity' => 5,
    ]);

    $this->actingAs($user)
        ->post(route('stocks.draft.store'), [
            'name' => 'indomie goreng',
            'purchase_price' => 3200,
            'selling_price' => 3700,
            'quantity' => 7,
        ])
        ->assertSessionHas('stock_in.draft', function (array $items): bool {
            return count($items) === 1
                && $items[0]['quantity'] === 12
                && (float) $items[0]['purchase_price'] === 3200.0;
        });
});

it('clears draft images when stock input is cancelled', function () {
    Storage::fake('public');
    Storage::disk('public')->put('products/1/draft.png', 'image');
    $user = stockInUser();

    $this->actingAs($user)
        ->withSession([
            'stock_in.draft' => [
                [
                    ...stockDraftItem('first', 'Indomie Goreng', 3000, 3500, 5),
                    'image_path' => 'products/1/draft.png',
                ],
            ],
        ])
        ->delete(route('stocks.draft.destroy'))
        ->assertSessionMissing('stock_in.draft')
        ->assertRedirect(route('dashboard'));

    Storage::disk('public')->assertMissing('products/1/draft.png');
});

it('renders all drafted products on confirmation', function () {
    $user = stockInUser();
    $draft = [
        stockDraftItem('first', 'Indomie Goreng', 3000, 3500, 50),
        stockDraftItem('second', 'Aqua 600 ml', 2000, 3000, 10),
    ];

    $this->actingAs($user)
        ->withSession(['stock_in.draft' => $draft])
        ->get(route('stocks.confirmation'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('stocks/stock-in-confirmation')
            ->has('products', 2)
            ->where('products.0.name', 'Indomie Goreng')
            ->where('products.1.quantity', 10));
});

it('stores a batch and updates an existing product only after final save', function () {
    $user = stockInUser();
    $existing = Product::create([
        'business_id' => $user->business_id,
        'name' => 'Indomie Goreng',
        'stock' => 10,
        'purchase_price' => 2500,
        'selling_price' => 3000,
    ]);
    $draft = [
        stockDraftItem('first', 'Indomie Goreng', 3000, 3500, 5),
        stockDraftItem('second', 'Aqua 600 ml', 2000, 3000, 10),
    ];

    $response = $this->actingAs($user)
        ->withSession(['stock_in.draft' => $draft])
        ->post(route('stocks.store'), [
            'items' => [
                ['id' => 'first', 'quantity' => 7],
                ['id' => 'second', 'quantity' => 12],
            ],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('stocks.notification'))
        ->assertSessionMissing('stock_in.draft')
        ->assertSessionHas('stock_in.receipt', fn (array $items): bool => count($items) === 2
            && $items[0]['quantity_added'] === 7
            && $items[0]['stock_after'] === 17
            && $items[1]['stock_after'] === 12);

    expect($existing->fresh())
        ->stock->toBe(17)
        ->purchase_price->toBe('3000.00')
        ->selling_price->toBe('3500.00');

    $this->assertDatabaseHas('products', [
        'business_id' => $user->business_id,
        'name' => 'Aqua 600 ml',
        'stock' => 12,
    ]);
    $this->assertDatabaseCount('products', 2);
    $this->assertDatabaseCount('stock_movements', 2);
    $this->assertDatabaseHas('stock_movements', [
        'product_id' => $existing->id,
        'movement_type' => 'stock_in',
        'source' => 'manual_input',
        'quantity' => 7,
        'stock_before' => 10,
        'stock_after' => 17,
    ]);
});

it('renders the persisted receipt and clears it when finished', function () {
    $user = stockInUser();
    $receipt = [[
        'id' => 1,
        'name' => 'Indomie Goreng',
        'purchase_price' => 3000,
        'selling_price' => 3500,
        'quantity_added' => 7,
        'stock_after' => 17,
        'image_url' => null,
    ]];

    $this->actingAs($user)
        ->withSession(['stock_in.receipt' => $receipt])
        ->get(route('stocks.notification'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('stocks/stock-in-notification')
            ->where('products', $receipt));

    $this->actingAs($user)
        ->withSession(['stock_in.receipt' => $receipt])
        ->post(route('stocks.notification.finish'))
        ->assertSessionMissing('stock_in.receipt')
        ->assertRedirect(route('dashboard'));
});

function stockDraftItem(
    string $id,
    string $name,
    int $purchasePrice,
    int $sellingPrice,
    int $quantity,
): array {
    return [
        'id' => $id,
        'name' => $name,
        'purchase_price' => $purchasePrice,
        'selling_price' => $sellingPrice,
        'quantity' => $quantity,
        'image_path' => null,
        'image_url' => null,
    ];
}
