<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['buyer_business_id', 'seller_business_id', 'created_by_user_id', 'order_number', 'total_amount', 'status', 'notes', 'completed_at', 'cancelled_at'])]
class BusinessOrder extends Model
{
    protected $attributes = [
        'total_amount' => 0,
        'status' => 'pending',
    ];

    /** @return BelongsTo<Business, $this> */
    public function buyerBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'buyer_business_id');
    }

    /** @return BelongsTo<Business, $this> */
    public function sellerBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'seller_business_id');
    }

    /** @return BelongsTo<User, $this> */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /** @return HasMany<BusinessOrderItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(BusinessOrderItem::class);
    }

    /** @return HasMany<StockMovement, $this> */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }
}
