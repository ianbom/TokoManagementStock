<?php

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests from the supplier list page', function () {
    $this->get('/suppliers')->assertRedirect(route('login'));
});

it('renders the supplier list page for verified users', function () {
    $store = Business::query()->create(['code' => 'STORE-001', 'name' => 'Toko Utama', 'business_type' => 'store', 'owner_name' => 'Pemilik Toko', 'address' => 'Surabaya']);
    $supplier = Business::query()->create(['code' => 'SUP-001', 'name' => 'Supplier Asli', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Supplier', 'address' => 'Sidoarjo', 'business_category' => 'Sembako']);
    Product::query()->create(['business_id' => $supplier->id, 'name' => 'Beras', 'stock' => 10, 'purchase_price' => 50000, 'selling_price' => 55000]);

    $this->actingAs(User::factory()->create(['business_id' => $store->id]))
        ->get('/suppliers')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('suppliers/list-supplier')
            ->has('suppliers.data', 1)
            ->where('suppliers.data.0.name', 'Supplier Asli')
            ->where('suppliers.data.0.products_count', 1));
});
