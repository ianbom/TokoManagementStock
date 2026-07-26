<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['business_id', 'name', 'stock', 'purchase_price', 'selling_price', 'image'])]
class Product extends Model
{
    use SoftDeletes;

    protected $attributes = [
        'stock' => 0,
        'purchase_price' => 0,
        'selling_price' => 0,
    ];

    /** @return BelongsTo<Business, $this> */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /** @return HasMany<SaleItem, $this> */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /** @return HasMany<BusinessOrderItem, $this> */
    public function sellerOrderItems(): HasMany
    {
        return $this->hasMany(BusinessOrderItem::class, 'seller_product_id');
    }

    /** @return HasMany<BusinessOrderItem, $this> */
    public function buyerOrderItems(): HasMany
    {
        return $this->hasMany(BusinessOrderItem::class, 'buyer_product_id');
    }

    /** @return HasMany<StockMovement, $this> */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
        ];
    }
}
