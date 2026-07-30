<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use DateTimeInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_guests_are_redirected_from_the_admin_dashboard(): void
    {
        $this->get('/admin/dashboard')->assertRedirect(route('login'));
    }

    public function test_store_users_are_redirected_to_the_regular_dashboard(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'store']))
            ->get('/admin/dashboard')
            ->assertRedirect(route('dashboard'));
    }

    public function test_supplier_users_are_redirected_to_the_regular_dashboard(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'supplier']))
            ->get('/admin/dashboard')
            ->assertRedirect(route('dashboard'));
    }

    public function test_admin_users_can_view_the_admin_dashboard(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('admin/dashboard'));
    }

    public function test_admin_users_are_redirected_from_the_regular_dashboard(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get(route('dashboard'))
            ->assertRedirect('/admin/dashboard');
    }

    public function test_guests_are_redirected_from_admin_list_pages(): void
    {
        foreach ($this->adminListPages() as [$uri]) {
            $this->get($uri)->assertRedirect(route('login'));
        }
    }

    public function test_non_admin_users_are_redirected_from_admin_list_pages(): void
    {
        foreach (['store', 'supplier'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role]));

            foreach ($this->adminListPages() as [$uri]) {
                $this->get($uri)->assertRedirect(route('dashboard'));
            }

            $this->app['auth']->guard()->logout();
        }
    }

    public function test_admin_users_can_view_admin_list_pages(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']));

        foreach ($this->adminListPages() as [$uri, $component]) {
            $this->get($uri)
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_admin_dashboard_uses_database_metrics_and_businesses(): void
    {
        Carbon::setTestNow('2026-07-30 12:00:00');
        $admin = User::factory()->create(['role' => 'admin']);
        $store = $this->business('STORE-001', 'Toko Utama', 'store', now()->subDays(40));
        $supplier = $this->business('SUP-001', 'Supplier Baru', 'supplier', now()->subDays(5));
        $cashier = User::factory()->create(['business_id' => $store->id, 'role' => 'store']);
        Product::query()->create([
            'business_id' => $supplier->id,
            'name' => 'Beras Premium',
            'stock' => 20,
            'purchase_price' => 80000,
            'selling_price' => 90000,
        ]);
        Sale::query()->create([
            'business_id' => $store->id,
            'user_id' => $cashier->id,
            'invoice_number' => 'POS-001',
            'total_amount' => 125000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
                ->where('metrics.total_businesses.value', 2)
                ->where('metrics.total_users.value', 2)
                ->where('metrics.total_products.value', 1)
                ->where('metrics.transactions_this_month.value', 1)
                ->has('growth', 12)
                ->where('businesses.data.0.name', 'Supplier Baru'));
    }

    public function test_admin_products_are_filtered_sorted_and_summarized_from_database(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $business = $this->business('SUP-001', 'Supplier Utama', 'supplier');
        Product::query()->create([
            'business_id' => $business->id,
            'name' => 'Beras',
            'stock' => 0,
            'selling_price' => 80000,
        ]);
        Product::query()->create([
            'business_id' => $business->id,
            'name' => 'Gula',
            'stock' => 5,
            'selling_price' => 18000,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.products', ['search' => 'Gula', 'sort' => 'stock', 'direction' => 'desc']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.total.value', 2)
                ->where('summary.low_stock.value', 1)
                ->where('summary.out_of_stock.value', 1)
                ->has('rows.data', 1)
                ->where('rows.data.0.name', 'Gula')
                ->where('rows.data.0.status', 'low'));
    }

    public function test_admin_businesses_include_activity_status_and_relation_counts(): void
    {
        Carbon::setTestNow('2026-07-30 12:00:00');
        $admin = User::factory()->create(['role' => 'admin']);
        $active = $this->business('STORE-001', 'Toko Aktif', 'store');
        $this->business('SUP-001', 'Supplier Sepi', 'supplier');
        $cashier = User::factory()->create(['business_id' => $active->id, 'role' => 'store']);
        Product::query()->create(['business_id' => $active->id, 'name' => 'Produk', 'stock' => 2]);
        Sale::query()->create([
            'business_id' => $active->id,
            'user_id' => $cashier->id,
            'invoice_number' => 'POS-ACTIVE',
            'status' => 'completed',
            'completed_at' => now()->subDays(2),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.businesses', ['search' => 'Toko Aktif']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.total.value', 2)
                ->where('summary.stores.value', 1)
                ->where('summary.suppliers.value', 1)
                ->where('summary.active.value', 1)
                ->has('rows.data', 1)
                ->where('rows.data.0.users', 1)
                ->where('rows.data.0.products', 1)
                ->where('rows.data.0.status', 'active'));
    }

    public function test_admin_transactions_merge_sales_and_supplier_orders(): void
    {
        Carbon::setTestNow('2026-07-30 12:00:00');
        $admin = User::factory()->create(['role' => 'admin']);
        $store = $this->business('STORE-001', 'Toko Pembeli', 'store');
        $supplier = $this->business('SUP-001', 'Supplier Penjual', 'supplier');
        $cashier = User::factory()->create(['business_id' => $store->id, 'role' => 'store']);
        Sale::query()->create([
            'business_id' => $store->id,
            'user_id' => $cashier->id,
            'invoice_number' => 'POS-001',
            'total_amount' => 100000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);
        BusinessOrder::query()->create([
            'buyer_business_id' => $store->id,
            'seller_business_id' => $supplier->id,
            'created_by_user_id' => $cashier->id,
            'order_number' => 'ORD-001',
            'total_amount' => 200000,
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.transactions', [
                'search' => 'Pembelian',
                'sort' => 'amount',
                'direction' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.total.value', 2)
                ->where('summary.completed.value', 1)
                ->where('summary.pending.value', 1)
                ->where('summary.value.value', 100000)
                ->has('rows.data', 1)
                ->where('rows.data.0.invoice', 'ORD-001')
                ->where('rows.data.0.type', 'supplier_purchase'));
    }

    public function test_admin_users_are_loaded_with_business_and_verification_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $business = $this->business('STORE-001', 'Toko Utama', 'store');
        User::factory()->unverified()->create([
            'business_id' => $business->id,
            'role' => 'store',
            'name' => 'Pengguna Menunggu',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users', ['search' => 'Pengguna Menunggu']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('summary.total.value', 2)
                ->where('summary.admins.value', 1)
                ->where('summary.stores.value', 1)
                ->where('summary.suppliers.value', 0)
                ->has('rows.data', 1)
                ->where('rows.data.0.business', 'Toko Utama')
                ->where('rows.data.0.status', 'pending'));
    }

    /** @return array<int, array{string, string}> */
    private function adminListPages(): array
    {
        return [
            ['/admin/businesses', 'admin/list-business'],
            ['/admin/users', 'admin/list-users'],
            ['/admin/products', 'admin/list-products'],
            ['/admin/transactions', 'admin/list-transaction'],
        ];
    }

    private function business(
        string $code,
        string $name,
        string $type,
        ?DateTimeInterface $createdAt = null,
    ): Business {
        $business = Business::query()->create([
            'code' => $code,
            'name' => $name,
            'business_type' => $type,
            'owner_name' => "Pemilik {$name}",
            'address' => 'Surabaya',
        ]);

        if ($createdAt !== null) {
            $business->created_at = $createdAt;
            $business->save();
        }

        return $business;
    }
}
