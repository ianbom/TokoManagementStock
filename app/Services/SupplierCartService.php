<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SupplierCartService
{
    public function ensurePurchasableSupplier(User $user, Business $supplier): void
    {
        abort_if(
            $user->business_id === null
            || $supplier->business_type !== 'supplier'
            || $supplier->id === $user->business_id,
            404,
        );
    }

    public function add(User $user, Business $supplier, int $productId, int $quantity, Session $session): void
    {
        $product = $this->productFor($user, $supplier, $productId);
        $cart = $this->raw($user, $supplier, $session);
        $newQuantity = ($cart[$product->id] ?? 0) + $quantity;

        $this->ensureStock($product, $newQuantity);
        $cart[$product->id] = $newQuantity;
        $session->put($this->key($user, $supplier), $cart);
    }

    public function update(User $user, Business $supplier, Product $product, int $quantity, Session $session): void
    {
        $product = $this->productFor($user, $supplier, $product->id);
        $cart = $this->raw($user, $supplier, $session);

        if (! array_key_exists($product->id, $cart)) {
            throw ValidationException::withMessages(['product_id' => 'Produk tidak ada dalam keranjang.']);
        }

        $this->ensureStock($product, $quantity);
        $cart[$product->id] = $quantity;
        $session->put($this->key($user, $supplier), $cart);
    }

    public function remove(User $user, Business $supplier, Product $product, Session $session): void
    {
        $this->productFor($user, $supplier, $product->id);
        $cart = $this->raw($user, $supplier, $session);
        unset($cart[$product->id]);
        $session->put($this->key($user, $supplier), $cart);
    }

    /** @return array{items: array<int, array<string, int|float|string|null>>, item_count: int, subtotal: float, total: float} */
    public function summary(User $user, Business $supplier, Session $session): array
    {
        $cart = $this->raw($user, $supplier, $session);
        $products = Product::query()
            ->where('business_id', $supplier->id)
            ->whereIn('id', array_keys($cart))
            ->get()
            ->keyBy('id');

        $items = collect($cart)->map(function (int $quantity, int|string $productId) use ($products): ?array {
            $product = $products->get((int) $productId);

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

        $total = (float) collect($items)->sum('subtotal');

        return [
            'items' => $items,
            'item_count' => (int) collect($items)->sum('quantity'),
            'subtotal' => $total,
            'total' => $total,
        ];
    }

    /** @return array<int, int> */
    public function raw(User $user, Business $supplier, Session $session): array
    {
        $cart = $session->get($this->key($user, $supplier), []);

        return is_array($cart) ? $cart : [];
    }

    public function clear(User $user, Business $supplier, Session $session): void
    {
        $session->forget($this->key($user, $supplier));
    }

    private function productFor(User $user, Business $supplier, int $productId): Product
    {
        $this->ensurePurchasableSupplier($user, $supplier);

        $product = Product::query()
            ->where('business_id', $supplier->id)
            ->find($productId);

        if ($product === null) {
            throw ValidationException::withMessages(['product_id' => 'Produk supplier tidak tersedia.']);
        }

        return $product;
    }

    private function ensureStock(Product $product, int $quantity): void
    {
        if ($quantity > $product->stock) {
            throw ValidationException::withMessages(['quantity' => 'Jumlah melebihi stok supplier.']);
        }
    }

    private function key(User $user, Business $supplier): string
    {
        return "supplier.cart.{$user->business_id}.{$supplier->id}";
    }
}
