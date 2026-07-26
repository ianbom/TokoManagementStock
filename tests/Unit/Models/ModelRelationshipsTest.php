<?php

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\BusinessOrderItem;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

it('defines every documented eloquent relationship', function () {
    $relations = [
        User::class => [
            'business' => BelongsTo::class,
            'sales' => HasMany::class,
            'createdBusinessOrders' => HasMany::class,
            'stockMovements' => HasMany::class,
            'messages' => HasMany::class,
        ],
        Business::class => [
            'users' => HasMany::class,
            'products' => HasMany::class,
            'sales' => HasMany::class,
            'purchaseOrders' => HasMany::class,
            'salesOrders' => HasMany::class,
            'stockMovements' => HasMany::class,
            'conversationsAsOne' => HasMany::class,
            'conversationsAsTwo' => HasMany::class,
            'messages' => HasMany::class,
        ],
        Product::class => [
            'business' => BelongsTo::class,
            'saleItems' => HasMany::class,
            'sellerOrderItems' => HasMany::class,
            'buyerOrderItems' => HasMany::class,
            'stockMovements' => HasMany::class,
        ],
        Sale::class => [
            'business' => BelongsTo::class,
            'user' => BelongsTo::class,
            'items' => HasMany::class,
            'stockMovements' => HasMany::class,
        ],
        SaleItem::class => [
            'sale' => BelongsTo::class,
            'product' => BelongsTo::class,
        ],
        BusinessOrder::class => [
            'buyerBusiness' => BelongsTo::class,
            'sellerBusiness' => BelongsTo::class,
            'createdBy' => BelongsTo::class,
            'items' => HasMany::class,
            'stockMovements' => HasMany::class,
        ],
        BusinessOrderItem::class => [
            'businessOrder' => BelongsTo::class,
            'sellerProduct' => BelongsTo::class,
            'buyerProduct' => BelongsTo::class,
        ],
        StockMovement::class => [
            'business' => BelongsTo::class,
            'product' => BelongsTo::class,
            'user' => BelongsTo::class,
            'sale' => BelongsTo::class,
            'businessOrder' => BelongsTo::class,
        ],
        Conversation::class => [
            'businessOne' => BelongsTo::class,
            'businessTwo' => BelongsTo::class,
            'messages' => HasMany::class,
        ],
        Message::class => [
            'conversation' => BelongsTo::class,
            'senderBusiness' => BelongsTo::class,
            'senderUser' => BelongsTo::class,
        ],
    ];

    foreach ($relations as $modelClass => $methods) {
        $model = new $modelClass;

        foreach ($methods as $method => $relationClass) {
            expect($model->{$method}())->toBeInstanceOf($relationClass);
        }
    }
});

it('uses soft deletes for documented models', function () {
    foreach ([User::class, Business::class, Product::class, Conversation::class, Message::class] as $modelClass) {
        expect(class_uses_recursive($modelClass))->toContain(SoftDeletes::class);
    }
});

it('defines database defaults and casts on transaction models', function () {
    expect((new Product)->getAttributes())->toMatchArray([
        'stock' => 0,
        'purchase_price' => 0,
        'selling_price' => 0,
    ])->and((new Sale)->getAttributes())->toMatchArray([
        'total_amount' => 0,
        'status' => 'pending',
    ])->and((new BusinessOrder)->getAttributes())->toMatchArray([
        'total_amount' => 0,
        'status' => 'pending',
    ])->and(StockMovement::UPDATED_AT)->toBeNull();

    expect((new Sale)->getCasts())->toMatchArray([
        'total_amount' => 'decimal:2',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ])->and((new Message)->getCasts())->toMatchArray([
        'read_at' => 'datetime',
    ]);
});
