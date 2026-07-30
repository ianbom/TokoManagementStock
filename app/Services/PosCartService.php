<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PosCartService
{
    public function add(User $user, int $productId, int $quantity, Session $session): void
    {
        $product = $this->productFor($user, $productId);
        $cart = $this->raw($user, $session);
        $quantity += $cart[$productId] ?? 0;

        $this->ensureStock($product, $quantity);
        $cart[$productId] = $quantity;
        $session->put($this->key($user), $cart);
    }

    public function update(User $user, Product $product, int $quantity, Session $session): void
    {
        $product = $this->productFor($user, $product->id);
        $this->ensureStock($product, $quantity);

        $cart = $this->raw($user, $session);
        $cart[$product->id] = $quantity;
        $session->put($this->key($user), $cart);
    }

    public function remove(User $user, Product $product, Session $session): void
    {
        $this->productFor($user, $product->id);
        $cart = $this->raw($user, $session);
        unset($cart[$product->id]);
        $session->put($this->key($user), $cart);
    }

    /** @return array{items: array<int, array<string, mixed>>, item_count: int, subtotal: float, total: float} */
    public function summary(User $user, Session $session): array
    {
        $cart = $this->raw($user, $session);
        $products = Product::query()
            ->where('business_id', $user->business_id)
            ->whereIn('id', array_keys($cart))
            ->get()
            ->keyBy('id');

        $items = collect($cart)->map(function (int $quantity, int $productId) use ($products): ?array {
            $product = $products->get($productId);

            if ($product === null) {
                return null;
            }

            $price = (float) $product->selling_price;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $price,
                'quantity' => $quantity,
                'subtotal' => $price * $quantity,
                'stock' => $product->stock,
                'image_url' => $product->image === null ? null : Storage::disk('public')->url($product->image),
            ];
        })->filter()->values()->all();

        $subtotal = (float) collect($items)->sum('subtotal');

        return [
            'items' => $items,
            'item_count' => (int) collect($items)->sum('quantity'),
            'subtotal' => $subtotal,
            'total' => $subtotal,
        ];
    }

    /** @return array<int, int> */
    public function raw(User $user, Session $session): array
    {
        return $session->get($this->key($user), []);
    }

    public function clear(User $user, Session $session): void
    {
        $session->put($this->key($user), []);
    }

    private function key(User $user): string
    {
        return "pos.cart.{$user->business_id}";
    }

    private function productFor(User $user, int $productId): Product
    {
        $product = Product::query()
            ->where('business_id', $user->business_id)
            ->find($productId);

        if ($product === null) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak tersedia.']);
        }

        return $product;
    }

    private function ensureStock(Product $product, int $quantity): void
    {
        if ($quantity > $product->stock) {
            throw ValidationException::withMessages(['quantity' => 'Jumlah melebihi stok tersedia.']);
        }
    }
}
