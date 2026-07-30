<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $business = Business::updateOrCreate(
            ['code' => 'TOKO-KETINTANG'],
            [
                'name' => 'Toko Ketintang Mart',
                'business_type' => 'store',
                'owner_name' => 'Test User',
                'address' => 'Ketintang, Surabaya',
            ],
        );

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'business_id' => $business->id,
                'name' => 'Test User',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'store',
            ],
        );

        $products = [
            ['name' => 'Indomie Goreng', 'stock' => 120, 'purchase_price' => 2500, 'selling_price' => 3500],
            ['name' => 'Aqua 600 ml', 'stock' => 40, 'purchase_price' => 3000, 'selling_price' => 4000],
            ['name' => 'Minyak Goreng 1L', 'stock' => 18, 'purchase_price' => 16000, 'selling_price' => 18000],
            ['name' => 'Beras Ramos 5kg', 'stock' => 12, 'purchase_price' => 65000, 'selling_price' => 72000],
            ['name' => 'Gula Pasir 1kg', 'stock' => 24, 'purchase_price' => 14000, 'selling_price' => 16000],
            ['name' => 'Teh Pucuk 350ml', 'stock' => 30, 'purchase_price' => 2800, 'selling_price' => 3500],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['business_id' => $business->id, 'name' => $product['name']],
                $product,
            );
        }
    }
}
