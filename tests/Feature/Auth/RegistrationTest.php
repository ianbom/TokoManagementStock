<?php

namespace Tests\Feature\Auth;

use App\Models\Business;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_store_users_can_register_with_business_data()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'store',
            'business_name' => 'Toko Sejahtera',
            'address' => 'Jl. Ketintang No. 1',
            'owner_name' => 'Test Owner',
            'phone' => '081234567890',
            'business_category' => 'Sembako',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $business = Business::query()->sole();
        $user = User::query()->sole();

        $this->assertSame('TOKO-0001', $business->code);
        $this->assertSame('store', $business->business_type);
        $this->assertSame('Toko Sejahtera', $business->name);
        $this->assertSame('Jl. Ketintang No. 1', $business->address);
        $this->assertSame('Test Owner', $business->owner_name);
        $this->assertSame('081234567890', $business->phone);
        $this->assertSame('Sembako', $business->business_category);
        $this->assertSame($business->id, $user->business_id);
        $this->assertSame('store', $user->role);
    }

    public function test_new_supplier_users_can_register_with_supplier_role()
    {
        $this->post(route('register.store'), [
            'name' => 'Supplier User',
            'email' => 'supplier@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'supplier',
            'business_name' => 'Supplier Makmur',
            'address' => 'Jl. Industri No. 2',
            'owner_name' => 'Supplier Owner',
            'phone' => '081298765432',
            'business_category' => 'Distributor',
        ])->assertRedirect(route('dashboard', absolute: false));

        $business = Business::query()->sole();
        $user = User::query()->sole();

        $this->assertSame('SUP-0001', $business->code);
        $this->assertSame('supplier', $business->business_type);
        $this->assertSame('supplier', $user->role);
        $this->assertSame($business->id, $user->business_id);
    }

    public function test_registration_rejects_invalid_business_data()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Invalid User',
            'email' => 'invalid@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'admin',
        ]);

        $response->assertSessionHasErrors([
            'account_type',
            'business_name',
            'address',
            'owner_name',
            'phone',
            'business_category',
        ]);
        $this->assertGuest();
        $this->assertDatabaseCount('businesses', 0);
        $this->assertDatabaseCount('users', 0);
    }

    public function test_failed_registration_does_not_leave_an_orphan_business()
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $this->post(route('register.store'), [
            'name' => 'Duplicate User',
            'email' => 'duplicate@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'store',
            'business_name' => 'Orphan Store',
            'address' => 'Jl. Test',
            'owner_name' => 'Duplicate Owner',
            'phone' => '081234567890',
            'business_category' => 'Retail',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('businesses', 0);
    }
}
