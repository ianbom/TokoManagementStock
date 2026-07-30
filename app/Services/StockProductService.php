<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class StockProductService
{
    /** @param array<string, mixed> $data */
    public function update(User $user, Product $product, array $data, ?UploadedFile $image): void
    {
        $storedImage = $image?->store("products/{$user->business_id}", 'public');

        if ($storedImage === false) {
            throw ValidationException::withMessages(['image' => 'Gambar gagal disimpan.']);
        }

        $oldImage = null;

        try {
            DB::transaction(function () use ($user, $product, $data, $storedImage, &$oldImage): void {
                $product = Product::query()
                    ->whereKey($product->id)
                    ->where('business_id', $user->business_id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $stockBefore = $product->stock;
                $stockAfter = (int) $data['stock'];

                if ($storedImage !== null) {
                    $oldImage = $product->image;
                }

                $product->update([
                    'name' => trim((string) $data['name']),
                    'stock' => $stockAfter,
                    'purchase_price' => $data['purchase_price'],
                    'selling_price' => $data['selling_price'],
                    'image' => $storedImage ?? $product->image,
                ]);

                if ($stockAfter === $stockBefore) {
                    return;
                }

                StockMovement::query()->create([
                    'business_id' => $user->business_id,
                    'product_id' => $product->id,
                    'user_id' => $user->id,
                    'movement_type' => $stockAfter > $stockBefore ? 'stock_in' : 'stock_out',
                    'source' => 'manual_input',
                    'quantity' => abs($stockAfter - $stockBefore),
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockAfter,
                    'description' => 'Penyesuaian stok manual',
                ]);
            });
        } catch (Throwable $exception) {
            if ($storedImage !== null) {
                Storage::disk('public')->delete($storedImage);
            }

            throw $exception;
        }

        if ($oldImage !== null && ! Product::withTrashed()->where('image', $oldImage)->exists()) {
            Storage::disk('public')->delete($oldImage);
        }
    }
}
