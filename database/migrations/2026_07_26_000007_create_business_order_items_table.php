<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seller_product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('buyer_product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->string('product_name');
            $table->unsignedInteger('quantity');
            $table->decimal('price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_order_items');
    }
};
