<?php

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function historyBusiness(string $code = 'TOKO-HISTORY'): Business
{
    return Business::create([
        'code' => $code,
        'name' => "Business {$code}",
        'business_type' => 'store',
        'owner_name' => 'Owner History',
        'address' => 'Jakarta',
    ]);
}

function historyUser(Business $business): User
{
    return User::factory()->create([
        'business_id' => $business->id,
        'role' => 'store',
    ]);
}

function historyProduct(Business $business, string $name = 'Indomie Goreng'): Product
{
    return Product::create([
        'business_id' => $business->id,
        'name' => $name,
        'stock' => 20,
        'purchase_price' => 2500,
        'selling_price' => 3500,
    ]);
}

function historyMovement(
    User $user,
    Product $product,
    string $movementType,
    string $source,
    int $quantity,
    string $createdAt,
    ?Sale $sale = null,
    ?BusinessOrder $businessOrder = null,
): StockMovement {
    return StockMovement::forceCreate([
        'business_id' => $user->business_id,
        'product_id' => $product->id,
        'user_id' => $user->id,
        'sale_id' => $sale?->id,
        'business_order_id' => $businessOrder?->id,
        'movement_type' => $movementType,
        'source' => $source,
        'quantity' => $quantity,
        'stock_before' => 20,
        'stock_after' => $movementType === 'stock_in' ? 20 + $quantity : 20 - $quantity,
        'description' => 'Aktivitas pengujian',
        'created_at' => $createdAt,
    ]);
}

it('redirects guests from the transaction history page', function () {
    $this->get('/transactions/history')->assertRedirect(route('login'));
});

it('requires a business to view transaction history', function () {
    $this->actingAs(User::factory()->create())
        ->get('/transactions/history')
        ->assertForbidden();
});

it('renders todays movements only for the active business with summary data', function () {
    $this->travelTo('2026-07-30 12:00:00');
    $business = historyBusiness();
    $otherBusiness = historyBusiness('TOKO-OTHER-HISTORY');
    $user = historyUser($business);
    $otherUser = historyUser($otherBusiness);
    $product = historyProduct($business);

    historyMovement($user, $product, 'stock_in', 'manual_input', 5, '2026-07-30 09:00:00');
    historyMovement($user, $product, 'stock_out', 'pos_sale', 2, '2026-07-30 10:00:00');
    historyMovement($user, $product, 'stock_in', 'manual_input', 3, '2026-07-29 10:00:00');
    historyMovement(
        $otherUser,
        historyProduct($otherBusiness),
        'stock_in',
        'manual_input',
        9,
        '2026-07-30 11:00:00',
    );

    $this->actingAs($user)
        ->get(route('transactions.history'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transactions/history')
            ->has('transactions.data', 2)
            ->where('transactions.data.0.quantity', 2)
            ->where('transactions.data.1.quantity', 5)
            ->where('summary.total', 2)
            ->where('summary.stock_in', 1)
            ->where('summary.stock_out', 1)
            ->where('filters.search', '')
            ->where('filters.type', 'all')
            ->where('filters.period', 'today')
            ->where('filters.sort', 'latest'));
});

it('searches filters and sorts stock movements through query parameters', function () {
    $this->travelTo('2026-07-30 12:00:00');
    $business = historyBusiness();
    $user = historyUser($business);
    $indomie = historyProduct($business);
    $water = historyProduct($business, 'Aqua 600 ml');

    historyMovement($user, $indomie, 'stock_out', 'pos_sale', 2, '2026-07-28 09:00:00');
    historyMovement($user, $indomie, 'stock_out', 'pos_sale', 4, '2026-07-30 09:00:00');
    historyMovement($user, $water, 'stock_out', 'pos_sale', 6, '2026-07-29 09:00:00');

    $this->actingAs($user)
        ->get(route('transactions.history', [
            'search' => 'Indomie',
            'type' => 'out',
            'period' => 'week',
            'sort' => 'oldest',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('transactions.data', 2)
            ->where('transactions.data.0.quantity', 2)
            ->where('transactions.data.1.quantity', 4)
            ->where('summary.total', 2)
            ->where('filters.search', 'Indomie')
            ->where('filters.type', 'out')
            ->where('filters.period', 'week')
            ->where('filters.sort', 'oldest'));
});

it('paginates transaction history by fifteen rows', function () {
    $this->travelTo('2026-07-30 12:00:00');
    $business = historyBusiness();
    $user = historyUser($business);
    $product = historyProduct($business);

    foreach (range(1, 16) as $index) {
        historyMovement(
            $user,
            $product,
            'stock_in',
            'manual_input',
            $index,
            "2026-07-30 10:00:{$index}",
        );
    }

    $this->actingAs($user)
        ->get(route('transactions.history'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('transactions.data', 15)
            ->where('transactions.current_page', 1)
            ->where('transactions.last_page', 2)
            ->where('transactions.total', 16));
});

it('returns complete POS transaction detail for the active business', function () {
    $business = historyBusiness();
    $user = historyUser($business);
    $product = historyProduct($business);
    $sale = Sale::create([
        'business_id' => $business->id,
        'user_id' => $user->id,
        'invoice_number' => 'POS-DETAIL-001',
        'total_amount' => 7000,
        'status' => 'completed',
        'customer_name' => 'Budi',
        'notes' => 'Tunai',
        'completed_at' => now(),
    ]);
    $sale->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'price' => 3500,
        'subtotal' => 7000,
    ]);
    $movement = historyMovement($user, $product, 'stock_out', 'pos_sale', 2, now()->toDateTimeString(), $sale);

    $this->actingAs($user)
        ->getJson(route('transactions.show', $movement))
        ->assertOk()
        ->assertJsonPath('transaction.id', $movement->id)
        ->assertJsonPath('transaction.document.kind', 'sale')
        ->assertJsonPath('transaction.document.number', 'POS-DETAIL-001')
        ->assertJsonPath('transaction.document.customer_name', 'Budi')
        ->assertJsonPath('transaction.document.total', 7000)
        ->assertJsonCount(1, 'transaction.document.items');
});

it('returns complete supplier order detail', function () {
    $buyer = historyBusiness();
    $supplier = historyBusiness('SUP-HISTORY');
    $supplier->update(['business_type' => 'supplier']);
    $user = historyUser($buyer);
    $sellerUser = historyUser($supplier);
    $sellerProduct = historyProduct($supplier, 'Minyak Goreng');
    $buyerProduct = historyProduct($buyer, 'Minyak Goreng');
    $order = BusinessOrder::create([
        'buyer_business_id' => $buyer->id,
        'seller_business_id' => $supplier->id,
        'created_by_user_id' => $user->id,
        'order_number' => 'ORDER-DETAIL-001',
        'total_amount' => 45000,
        'status' => 'completed',
        'completed_at' => now(),
    ]);
    $order->items()->create([
        'seller_product_id' => $sellerProduct->id,
        'buyer_product_id' => $buyerProduct->id,
        'product_name' => 'Minyak Goreng',
        'quantity' => 3,
        'price' => 15000,
        'subtotal' => 45000,
    ]);
    $movement = historyMovement(
        $user,
        $buyerProduct,
        'stock_in',
        'business_purchase',
        3,
        now()->toDateTimeString(),
        businessOrder: $order,
    );

    $this->actingAs($user)
        ->getJson(route('transactions.show', $movement))
        ->assertOk()
        ->assertJsonPath('transaction.document.kind', 'business_order')
        ->assertJsonPath('transaction.document.number', 'ORDER-DETAIL-001')
        ->assertJsonPath('transaction.document.partner_name', $supplier->name)
        ->assertJsonCount(1, 'transaction.document.items');

    expect($sellerUser->business_id)->toBe($supplier->id);
});

it('hides transaction details owned by another business', function () {
    $business = historyBusiness();
    $otherBusiness = historyBusiness('TOKO-OTHER-HISTORY');
    $user = historyUser($business);
    $otherUser = historyUser($otherBusiness);
    $movement = historyMovement(
        $otherUser,
        historyProduct($otherBusiness),
        'stock_in',
        'manual_input',
        5,
        now()->toDateTimeString(),
    );

    $this->actingAs($user)
        ->getJson(route('transactions.show', $movement))
        ->assertNotFound();
});
