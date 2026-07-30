<?php

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function supplierFlowBusiness(string $code, string $name, string $type = 'supplier'): Business
{
    return Business::query()->create([
        'code' => $code,
        'name' => $name,
        'business_type' => $type,
        'owner_name' => "Pemilik {$name}",
        'address' => 'Surabaya',
        'business_category' => $type === 'supplier' ? 'Sembako' : 'Toko',
    ]);
}

function supplierFlowProduct(Business $business, string $name, int $stock, float $price, ?string $image = null): Product
{
    return Product::query()->create([
        'business_id' => $business->id,
        'name' => $name,
        'stock' => $stock,
        'purchase_price' => $price - 1000,
        'selling_price' => $price,
        'image' => $image,
    ]);
}

it('redirects guests from supplier purchase pages', function () {
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');

    $this->get(route('suppliers.buy', $supplier))->assertRedirect(route('login'));
    $this->get(route('suppliers.checkout', $supplier))->assertRedirect(route('login'));
});

it('shows searchable products owned by the selected supplier', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Toko Pembeli', 'store');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $otherSupplier = supplierFlowBusiness('SUP-002', 'Supplier Lain');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    supplierFlowProduct($supplier, 'Beras Premium', 12, 50000);
    supplierFlowProduct($supplier, 'Minyak Goreng', 0, 18000);
    supplierFlowProduct($otherSupplier, 'Beras Milik Supplier Lain', 20, 45000);

    $this->actingAs($user)
        ->get(route('suppliers.buy', ['supplier' => $supplier, 'search' => 'Beras']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('suppliers/buy-product')
            ->where('supplier.name', 'Supplier Utama')
            ->where('filters.search', 'Beras')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Beras Premium')
            ->where('cart.item_count', 0));
});

it('adds updates and removes supplier cart items', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Toko Pembeli', 'store');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    $product = supplierFlowProduct($supplier, 'Beras Premium', 12, 50000);

    $this->actingAs($user)
        ->post(route('suppliers.cart.store', $supplier), ['product_id' => $product->id, 'quantity' => 2])
        ->assertRedirect();

    $this->patch(route('suppliers.cart.update', [$supplier, $product]), ['quantity' => 3])
        ->assertRedirect();

    $this->get(route('suppliers.checkout', $supplier))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('cart.item_count', 3)
            ->where('cart.total', 150000)
            ->where('cart.items.0.quantity', 3));

    $this->delete(route('suppliers.cart.destroy', [$supplier, $product]))->assertRedirect();

    $this->get(route('suppliers.buy', $supplier))
        ->assertInertia(fn (Assert $page) => $page->where('cart.item_count', 0));
});

it('rejects products from another supplier and quantities above stock', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Toko Pembeli', 'store');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $otherSupplier = supplierFlowBusiness('SUP-002', 'Supplier Lain');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    $product = supplierFlowProduct($supplier, 'Beras Premium', 2, 50000);
    $otherProduct = supplierFlowProduct($otherSupplier, 'Minyak Goreng', 10, 18000);

    $this->actingAs($user)
        ->post(route('suppliers.cart.store', $supplier), ['product_id' => $otherProduct->id, 'quantity' => 1])
        ->assertSessionHasErrors('product_id');

    $this->post(route('suppliers.cart.store', $supplier), ['product_id' => $product->id, 'quantity' => 3])
        ->assertSessionHasErrors('quantity');
});

it('completes a supplier order and transfers stock atomically', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Toko Pembeli', 'store');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    $rice = supplierFlowProduct($supplier, 'Beras Premium', 10, 50000, 'products/rice.jpg');
    $oil = supplierFlowProduct($supplier, 'Minyak Goreng', 5, 18000, 'products/oil.jpg');
    $existingRice = supplierFlowProduct($buyer, 'beras premium', 4, 60000);
    $existingRice->update(['selling_price' => 65000]);

    $this->actingAs($user)
        ->post(route('suppliers.cart.store', $supplier), ['product_id' => $rice->id, 'quantity' => 2]);
    $this->post(route('suppliers.cart.store', $supplier), ['product_id' => $oil->id, 'quantity' => 1]);

    $response = $this->post(route('suppliers.checkout.store', $supplier));
    $order = BusinessOrder::query()->firstOrFail();

    $response->assertRedirect(route('suppliers.notification', $order));
    expect($order->status)->toBe('completed')
        ->and((float) $order->total_amount)->toBe(118000.0)
        ->and($order->items()->count())->toBe(2)
        ->and($rice->refresh()->stock)->toBe(8)
        ->and($oil->refresh()->stock)->toBe(4)
        ->and($existingRice->refresh()->stock)->toBe(6)
        ->and((float) $existingRice->selling_price)->toBe(65000.0);

    $buyerOil = Product::query()
        ->where('business_id', $buyer->id)
        ->where('name', 'Minyak Goreng')
        ->firstOrFail();

    expect($buyerOil->stock)->toBe(1)
        ->and((float) $buyerOil->purchase_price)->toBe(18000.0)
        ->and((float) $buyerOil->selling_price)->toBe(18000.0)
        ->and($buyerOil->image)->toBe('products/oil.jpg')
        ->and(StockMovement::query()->where('business_order_id', $order->id)->count())->toBe(4)
        ->and(StockMovement::query()->where('source', 'business_sale')->count())->toBe(2)
        ->and(StockMovement::query()->where('source', 'business_purchase')->count())->toBe(2);

    $this->get(route('suppliers.notification', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('suppliers/checkout-notification')
            ->where('order.order_number', $order->order_number)
            ->where('order.status', 'completed')
            ->has('order.items', 2));

    $this->get(route('suppliers.checkout', $supplier))
        ->assertRedirect(route('suppliers.buy', $supplier));
});

it('rolls back checkout when supplier stock changes', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Toko Pembeli', 'store');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    $product = supplierFlowProduct($supplier, 'Beras Premium', 2, 50000);

    $this->actingAs($user)
        ->post(route('suppliers.cart.store', $supplier), ['product_id' => $product->id, 'quantity' => 2]);
    $product->update(['stock' => 1]);

    $this->post(route('suppliers.checkout.store', $supplier))
        ->assertSessionHasErrors('cart');

    expect(BusinessOrder::query()->count())->toBe(0)
        ->and(StockMovement::query()->count())->toBe(0)
        ->and(Product::query()->where('business_id', $buyer->id)->count())->toBe(0)
        ->and($product->refresh()->stock)->toBe(1);
});

it('prevents opening another buyers order or buying from self', function () {
    $buyer = supplierFlowBusiness('BUY-001', 'Supplier Pembeli');
    $supplier = supplierFlowBusiness('SUP-001', 'Supplier Utama');
    $otherBuyer = supplierFlowBusiness('BUY-002', 'Toko Lain', 'store');
    $user = User::factory()->create(['business_id' => $buyer->id]);
    $otherUser = User::factory()->create(['business_id' => $otherBuyer->id]);
    $order = BusinessOrder::query()->create([
        'buyer_business_id' => $buyer->id,
        'seller_business_id' => $supplier->id,
        'created_by_user_id' => $user->id,
        'order_number' => 'ORD-TEST',
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    $this->actingAs($otherUser)
        ->get(route('suppliers.notification', $order))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('suppliers.buy', $buyer))
        ->assertNotFound();
});
