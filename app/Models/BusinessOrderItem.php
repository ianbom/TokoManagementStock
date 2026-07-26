<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['business_order_id', 'seller_product_id', 'buyer_product_id', 'product_name', 'quantity', 'price', 'subtotal'])]
class BusinessOrderItem extends Model
{
    /** @return BelongsTo<BusinessOrder, $this> */
    public function businessOrder(): BelongsTo
    {
        return $this->belongsTo(BusinessOrder::class);
    }

    /** @return BelongsTo<Product, $this> */
    public function sellerProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'seller_product_id');
    }

    /** @return BelongsTo<Product, $this> */
    public function buyerProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'buyer_product_id');
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }
}
