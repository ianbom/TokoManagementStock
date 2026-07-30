<?php

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('creates every domain table with the documented columns', function () {
    $tables = [
        'businesses' => ['id', 'code', 'name', 'business_type', 'owner_name', 'address', 'created_at', 'updated_at', 'deleted_at'],
        'users' => ['id', 'business_id', 'name', 'email', 'password', 'role', 'created_at', 'updated_at', 'deleted_at'],
        'products' => ['id', 'business_id', 'name', 'stock', 'purchase_price', 'selling_price', 'image', 'created_at', 'updated_at', 'deleted_at'],
        'sales' => ['id', 'business_id', 'user_id', 'invoice_number', 'total_amount', 'status', 'customer_name', 'notes', 'completed_at', 'cancelled_at', 'created_at', 'updated_at'],
        'sale_items' => ['id', 'sale_id', 'product_id', 'product_name', 'quantity', 'price', 'subtotal', 'created_at', 'updated_at'],
        'business_orders' => ['id', 'buyer_business_id', 'seller_business_id', 'created_by_user_id', 'order_number', 'total_amount', 'status', 'notes', 'completed_at', 'cancelled_at', 'created_at', 'updated_at'],
        'business_order_items' => ['id', 'business_order_id', 'seller_product_id', 'buyer_product_id', 'product_name', 'quantity', 'price', 'subtotal', 'created_at', 'updated_at'],
        'stock_movements' => ['id', 'business_id', 'product_id', 'user_id', 'sale_id', 'business_order_id', 'movement_type', 'source', 'quantity', 'stock_before', 'stock_after', 'description', 'created_at'],
        'conversations' => ['id', 'business_one_id', 'business_two_id', 'last_message_at', 'created_at', 'updated_at', 'deleted_at'],
        'messages' => ['id', 'conversation_id', 'sender_business_id', 'sender_user_id', 'message', 'media', 'media_type', 'read_at', 'created_at', 'updated_at', 'deleted_at'],
    ];

    foreach ($tables as $table => $columns) {
        expect(Schema::hasTable($table))->toBeTrue()
            ->and(Schema::hasColumns($table, $columns))->toBeTrue();
    }
});

it('uses store as the canonical default user role', function () {
    $userId = DB::table('users')->insertGetId([
        'name' => 'Store Owner',
        'email' => 'owner@example.com',
        'password' => 'password',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect(DB::table('users')->find($userId)->role)->toBe('store');
});

it('enforces one conversation for each ordered business pair', function () {
    $firstBusinessId = DB::table('businesses')->insertGetId([
        'code' => 'STORE-0001',
        'name' => 'Store One',
        'business_type' => 'store',
        'owner_name' => 'Owner One',
        'address' => 'Address One',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $secondBusinessId = DB::table('businesses')->insertGetId([
        'code' => 'SUP-0001',
        'name' => 'Supplier One',
        'business_type' => 'supplier',
        'owner_name' => 'Owner Two',
        'address' => 'Address Two',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('conversations')->insert([
        'business_one_id' => $firstBusinessId,
        'business_two_id' => $secondBusinessId,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect(fn () => DB::table('conversations')->insert([
        'business_one_id' => $firstBusinessId,
        'business_two_id' => $secondBusinessId,
        'created_at' => now(),
        'updated_at' => now(),
    ]))->toThrow(QueryException::class);
});
