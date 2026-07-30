<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PosCheckoutService
{
    public function __construct(private readonly PosCartService $cartService) {}

    /** @param array{customer_name?: string|null, notes?: string|null} $data */
    public function checkout(User $user, array $data, Session $session): Sale
    {
        $cart = $this->cartService->raw($user, $session);

        if ($cart === []) {
            throw ValidationException::withMessages(['cart' => 'Keranjang masih kosong.']);
        }

        $sale = DB::transaction(function () use ($user, $data, $cart): Sale {
            $products = Product::query()
                ->where('business_id', $user->business_id)
                ->whereIn('id', array_keys($cart))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== count($cart)) {
                throw ValidationException::withMessages(['cart' => 'Produk dalam keranjang tidak lagi tersedia.']);
            }

            $total = 0.0;
            foreach ($cart as $productId => $quantity) {
                $product = $products->get((int) $productId);
                if ($product === null || $quantity < 1 || $quantity > $product->stock) {
                    throw ValidationException::withMessages(['cart' => 'Stok produk berubah. Periksa keranjang kembali.']);
                }

                $total += (float) $product->selling_price * $quantity;
            }

            $sale = Sale::create([
                'business_id' => $user->business_id,
                'user_id' => $user->id,
                'invoice_number' => 'POS-'.now()->format('Ymd').'-'.Str::ulid(),
                'total_amount' => $total,
                'status' => 'completed',
                'customer_name' => $data['customer_name'] ?? null,
                'notes' => $data['notes'] ?? null,
                'completed_at' => now(),
            ]);

            foreach ($cart as $productId => $quantity) {
                $product = $products->get((int) $productId);
                $stockBefore = $product->stock;
                $price = (float) $product->selling_price;

                $sale->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $price * $quantity,
                ]);

                $product->update(['stock' => $stockBefore - $quantity]);

                StockMovement::create([
                    'business_id' => $user->business_id,
                    'product_id' => $product->id,
                    'user_id' => $user->id,
                    'sale_id' => $sale->id,
                    'movement_type' => 'stock_out',
                    'source' => 'pos_sale',
                    'quantity' => $quantity,
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockBefore - $quantity,
                    'description' => "Penjualan {$sale->invoice_number}",
                ]);
            }

            return $sale;
        });

        $this->cartService->clear($user, $session);

        return $sale;
    }
}
