<?php

namespace Tests\Feature\Settings;

use App\Models\Business;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed()
    {
        $business = $this->createBusiness();
        $user = User::factory()->create(['business_id' => $business->id]);

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/profile')
                ->where('business.name', $business->name)
                ->has('passwordRules')
            );
    }

    public function test_name_can_be_updated_without_submitting_email()
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Agus Santoso',
                'password' => '',
                'password_confirmation' => '',
                'current_password' => '',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Agus Santoso', $user->name);
        $this->assertNotNull($user->email);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_password_can_be_updated_from_profile()
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => $user->name,
                'current_password' => 'password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_current_password_is_required_to_change_password_from_profile()
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->patch(route('profile.update'), [
                'name' => $user->name,
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasErrors('current_password')
            ->assertRedirect(route('profile.edit'));

        $this->assertTrue(Hash::check('password', $user->refresh()->password));
    }

    public function test_business_information_can_be_updated()
    {
        $business = $this->createBusiness();
        $user = User::factory()->create(['business_id' => $business->id]);

        $this
            ->actingAs($user)
            ->patch(route('business-profile.update'), [
                'business_category' => 'Minimarket',
                'name' => 'Ketintang Mart',
                'owner_name' => 'Agus Santoso',
                'phone' => '081234567890',
                'address' => 'Jl. Ketintang Baru Selatan No. 7, Surabaya',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('businesses', [
            'id' => $business->id,
            'business_category' => 'Minimarket',
            'name' => 'Ketintang Mart',
            'owner_name' => 'Agus Santoso',
            'phone' => '081234567890',
        ]);
    }

    public function test_business_is_created_for_legacy_user_without_business()
    {
        $user = User::factory()->create([
            'business_id' => null,
            'role' => 'supplier',
        ]);

        $this
            ->actingAs($user)
            ->patch(route('business-profile.update'), [
                'business_category' => 'Grosir',
                'name' => 'Supplier Ketintang',
                'owner_name' => $user->name,
                'phone' => '081234567890',
                'address' => 'Surabaya',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $business = $user->refresh()->business;

        $this->assertNotNull($business);
        $this->assertSame('supplier', $business->business_type);
        $this->assertSame(sprintf('SUP-%04d', $business->id), $business->code);
    }

    public function test_business_information_is_validated()
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->patch(route('business-profile.update'), [
                'business_category' => '',
                'name' => '',
                'owner_name' => '',
                'phone' => '',
                'address' => '',
            ])
            ->assertSessionHasErrors([
                'business_category',
                'name',
                'owner_name',
                'phone',
                'address',
            ])
            ->assertRedirect(route('profile.edit'));
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertSoftDeleted($user);
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }

    private function createBusiness(array $attributes = []): Business
    {
        return Business::create([
            'code' => 'TOKO-TEST',
            'name' => 'Toko Ketintang Mart',
            'business_type' => 'store',
            'owner_name' => 'Agus Santoso',
            'address' => 'Surabaya',
            'phone' => '081234567890',
            'business_category' => 'Toko Kelontong',
            ...$attributes,
        ]);
    }
}
