<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_without_a_business_receive_empty_dashboard_data(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('business', null)
                ->where('financial_summary.income', 0)
                ->where('financial_summary.expense', 0)
                ->where('financial_summary.gross_profit', 0)
                ->where('best_seller', null)
                ->has('suppliers', 0));
    }

    public function test_dashboard_uses_current_business_database_data(): void
    {
        Carbon::setTestNow('2026-07-15 10:00:00');

        try {
            $store = Business::query()->create([
                'code' => 'STORE-001',
                'name' => 'Toko Database',
                'business_type' => 'store',
                'owner_name' => 'Pemilik Toko',
                'address' => 'Surabaya',
            ]);
            $otherStore = Business::query()->create([
                'code' => 'STORE-002',
                'name' => 'Toko Lain',
                'business_type' => 'store',
                'owner_name' => 'Pemilik Lain',
                'address' => 'Gresik',
            ]);
            $user = User::factory()->create(['business_id' => $store->id]);
            $otherUser = User::factory()->create(['business_id' => $otherStore->id]);
            $product = Product::query()->create([
                'business_id' => $store->id,
                'name' => 'Produk Terlaris',
                'stock' => 10,
                'purchase_price' => 10000,
                'selling_price' => 15000,
            ]);
            $otherProduct = Product::query()->create([
                'business_id' => $otherStore->id,
                'name' => 'Produk Bisnis Lain',
                'stock' => 10,
                'purchase_price' => 5000,
                'selling_price' => 9000,
            ]);

            $sale = Sale::query()->create([
                'business_id' => $store->id,
                'user_id' => $user->id,
                'invoice_number' => 'POS-CURRENT',
                'total_amount' => 30000,
                'status' => 'completed',
                'completed_at' => now(),
            ]);
            $sale->items()->create([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => 2,
                'price' => 15000,
                'subtotal' => 30000,
            ]);

            Sale::query()->create([
                'business_id' => $store->id,
                'user_id' => $user->id,
                'invoice_number' => 'POS-PENDING',
                'total_amount' => 100000,
                'status' => 'pending',
            ]);
            Sale::query()->create([
                'business_id' => $store->id,
                'user_id' => $user->id,
                'invoice_number' => 'POS-OLD',
                'total_amount' => 90000,
                'status' => 'completed',
                'completed_at' => now()->subMonth(),
            ]);
            $otherSale = Sale::query()->create([
                'business_id' => $otherStore->id,
                'user_id' => $otherUser->id,
                'invoice_number' => 'POS-OTHER',
                'total_amount' => 9000,
                'status' => 'completed',
                'completed_at' => now(),
            ]);
            $otherSale->items()->create([
                'product_id' => $otherProduct->id,
                'product_name' => $otherProduct->name,
                'quantity' => 1,
                'price' => 9000,
                'subtotal' => 9000,
            ]);

            Business::query()->forceCreate(['code' => 'SUP-OLD', 'name' => 'Supplier Lama', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Lama', 'address' => 'Malang', 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)]);
            Business::query()->forceCreate(['code' => 'SUP-NEW', 'name' => 'Supplier Baru', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Baru', 'address' => 'Sidoarjo', 'created_at' => now()->subDay(), 'updated_at' => now()->subDay()]);
            Business::query()->forceCreate(['code' => 'SUP-LATEST', 'name' => 'Supplier Terbaru', 'business_type' => 'supplier', 'owner_name' => 'Pemilik Terbaru', 'address' => 'Surabaya', 'created_at' => now(), 'updated_at' => now()]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('dashboard')
                    ->where('business.name', 'Toko Database')
                    ->where('financial_summary.income', 30000)
                    ->where('financial_summary.expense', 20000)
                    ->where('financial_summary.gross_profit', 10000)
                    ->where('financial_summary.period_label', 'Bulan Ini')
                    ->where('best_seller.name', 'Produk Terlaris')
                    ->where('best_seller.quantity_sold', 2)
                    ->has('suppliers', 3)
                    ->where('suppliers.0.name', 'Supplier Terbaru')
                    ->where('suppliers.1.name', 'Supplier Baru'));
        } finally {
            Carbon::setTestNow();
        }
    }
}
