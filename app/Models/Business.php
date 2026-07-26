<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['code', 'name', 'business_type', 'owner_name', 'address', 'phone', 'business_category'])]
class Business extends Model
{
    use SoftDeletes;

    /** @return HasMany<User, $this> */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** @return HasMany<Sale, $this> */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    /** @return HasMany<BusinessOrder, $this> */
    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(BusinessOrder::class, 'buyer_business_id');
    }

    /** @return HasMany<BusinessOrder, $this> */
    public function salesOrders(): HasMany
    {
        return $this->hasMany(BusinessOrder::class, 'seller_business_id');
    }

    /** @return HasMany<StockMovement, $this> */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /** @return HasMany<Conversation, $this> */
    public function conversationsAsOne(): HasMany
    {
        return $this->hasMany(Conversation::class, 'business_one_id');
    }

    /** @return HasMany<Conversation, $this> */
    public function conversationsAsTwo(): HasMany
    {
        return $this->hasMany(Conversation::class, 'business_two_id');
    }

    /** @return HasMany<Message, $this> */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_business_id');
    }
}
