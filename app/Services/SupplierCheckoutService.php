<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SupplierCheckoutService
{
    public function __construct(private readonly SupplierCartService $cartService) {}

    public function checkout(User $user, Business $supplier, Session $session): BusinessOrder
    {
        $this->cartService->ensurePurchasableSupplier($user, $supplier);
        $cart = $this->cartService->raw($user, $supplier, $session);

        if ($cart === []) {
            throw ValidationException::withMessages(['cart' => 'Keranjang supplier masih kosong.']);
        }

        $order = DB::transaction(function () use ($user, $supplier, $cart): BusinessOrder {
            $sellerProducts = Product::query()
                ->where('business_id', $supplier->id)
                ->whereIn('id', array_keys($cart))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($sellerProducts->count() !== count($cart)) {
                throw ValidationException::withMessages(['cart' => 'Produk supplier tidak lagi tersedia.']);
            }

            foreach ($cart as $productId => $quantity) {
                $sellerProduct = $sellerProducts->get((int) $productId);

                if ($sellerProduct === null || $quantity < 1 || $quantity > $sellerProduct->stock) {
                    throw ValidationException::withMessages(['cart' => 'Stok supplier berubah. Periksa keranjang kembali.']);
                }
            }

            $order = BusinessOrder::query()->create([
                'buyer_business_id' => $user->business_id,
                'seller_business_id' => $supplier->id,
                'created_by_user_id' => $user->id,
                'order_number' => 'ORD-'.now()->format('Ymd').'-'.Str::ulid(),
                'status' => 'pending',
            ]);
            $total = 0.0;

            foreach ($cart as $productId => $quantity) {
                $sellerProduct = $sellerProducts->get((int) $productId);
                $price = (float) $sellerProduct->selling_price;
                $subtotal = $price * $quantity;
                $sellerStockBefore = $sellerProduct->stock;
                $buyerProduct = Product::query()
                    ->where('business_id', $user->business_id)
                    ->whereRaw('LOWER(name) = ?', [Str::lower($sellerProduct->name)])
                    ->lockForUpdate()
                    ->first();

                if ($buyerProduct === null) {
                    $buyerProduct = Product::query()->create([
                        'business_id' => $user->business_id,
                        'name' => $sellerProduct->name,
                        'stock' => 0,
                        'purchase_price' => $price,
                        'selling_price' => $price,
                        'image' => $sellerProduct->image,
                    ]);
                }

                $buyerStockBefore = $buyerProduct->stock;
                $sellerProduct->update(['stock' => $sellerStockBefore - $quantity]);
                $buyerProduct->update([
                    'stock' => $buyerStockBefore + $quantity,
                    'purchase_price' => $price,
                ]);

                $order->items()->create([
                    'seller_product_id' => $sellerProduct->id,
                    'buyer_product_id' => $buyerProduct->id,
                    'product_name' => $sellerProduct->name,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                ]);

                StockMovement::query()->create([
                    'business_id' => $supplier->id,
                    'product_id' => $sellerProduct->id,
                    'user_id' => $user->id,
                    'business_order_id' => $order->id,
                    'movement_type' => 'stock_out',
                    'source' => 'business_sale',
                    'quantity' => $quantity,
                    'stock_before' => $sellerStockBefore,
                    'stock_after' => $sellerStockBefore - $quantity,
                    'description' => "Penjualan ke {$user->business?->name}",
                ]);

                StockMovement::query()->create([
                    'business_id' => $user->business_id,
                    'product_id' => $buyerProduct->id,
                    'user_id' => $user->id,
                    'business_order_id' => $order->id,
                    'movement_type' => 'stock_in',
                    'source' => 'business_purchase',
                    'quantity' => $quantity,
                    'stock_before' => $buyerStockBefore,
                    'stock_after' => $buyerStockBefore + $quantity,
                    'description' => "Pembelian dari {$supplier->name}",
                ]);

                $total += $subtotal;
            }

            $order->update([
                'total_amount' => $total,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return $order;
        });

        $this->cartService->clear($user, $supplier, $session);

        return $order;
    }
}
