<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StockInService
{
    public const DRAFT_KEY = 'stock_in.draft';

    public const RECEIPT_KEY = 'stock_in.receipt';

    /** @param array<string, mixed> $data */
    public function addDraft(User $user, array $data, ?UploadedFile $image, Session $session): void
    {
        $items = $session->get(self::DRAFT_KEY, []);
        $items = is_array($items) ? $items : [];
        $normalizedName = Str::lower(trim((string) $data['name']));
        $existingIndex = null;

        foreach ($items as $index => $item) {
            if (is_array($item) && Str::lower((string) $item['name']) === $normalizedName) {
                $existingIndex = $index;

                break;
            }
        }

        $storedPath = $image?->store("products/{$user->business_id}", 'public');

        if ($image !== null && ! is_string($storedPath)) {
            throw ValidationException::withMessages([
                'image' => 'Foto produk gagal disimpan.',
            ]);
        }

        $imagePath = is_string($storedPath) ? $storedPath : null;

        if ($existingIndex !== null) {
            $existing = $items[$existingIndex];

            if ($imagePath !== null && $existing['image_path'] !== null) {
                Storage::disk('public')->delete($existing['image_path']);
            }

            $items[$existingIndex] = [
                ...$existing,
                'name' => trim((string) $data['name']),
                'purchase_price' => (float) $data['purchase_price'],
                'selling_price' => (float) $data['selling_price'],
                'quantity' => $existing['quantity'] + (int) $data['quantity'],
                'image_path' => $imagePath ?? $existing['image_path'],
                'image_url' => $imagePath === null
                    ? $existing['image_url']
                    : Storage::disk('public')->url($imagePath),
            ];
        } else {
            $items[] = [
                'id' => (string) Str::uuid(),
                'name' => trim((string) $data['name']),
                'purchase_price' => (float) $data['purchase_price'],
                'selling_price' => (float) $data['selling_price'],
                'quantity' => (int) $data['quantity'],
                'image_path' => $imagePath,
                'image_url' => $imagePath === null ? null : Storage::disk('public')->url($imagePath),
            ];
        }

        $session->put(self::DRAFT_KEY, array_values($items));
        $session->forget(self::RECEIPT_KEY);
    }

    /**
     * @param  array<int, array{id: string, quantity: int}>  $submittedItems
     * @return array<int, array<string, int|float|string|null>>
     */
    public function store(User $user, array $submittedItems, Session $session): array
    {
        $draftItems = $session->get(self::DRAFT_KEY, []);
        $draftItems = is_array($draftItems) ? $draftItems : [];
        $draft = [];

        foreach ($draftItems as $item) {
            if (is_array($item) && isset($item['id'])) {
                $draft[(string) $item['id']] = $item;
            }
        }

        $oldImages = [];

        $receipt = DB::transaction(function () use ($user, $submittedItems, $draft, &$oldImages): array {
            return collect($submittedItems)->map(function (array $submitted) use ($user, $draft, &$oldImages): array {
                $item = $draft[$submitted['id']] ?? null;

                if (! is_array($item)) {
                    throw ValidationException::withMessages([
                        'items' => 'Produk draft tidak ditemukan.',
                    ]);
                }

                $quantity = (int) $submitted['quantity'];
                $product = Product::query()
                    ->where('business_id', $user->business_id)
                    ->whereRaw('LOWER(name) = ?', [Str::lower($item['name'])])
                    ->lockForUpdate()
                    ->first();
                $stockBefore = $product === null ? 0 : $product->stock;

                if ($product === null) {
                    $product = Product::create([
                        'business_id' => $user->business_id,
                        'name' => $item['name'],
                        'stock' => $quantity,
                        'purchase_price' => $item['purchase_price'],
                        'selling_price' => $item['selling_price'],
                        'image' => $item['image_path'],
                    ]);
                } else {
                    if ($item['image_path'] !== null && $product->image !== null) {
                        $oldImages[] = $product->image;
                    }

                    $product->update([
                        'stock' => $stockBefore + $quantity,
                        'purchase_price' => $item['purchase_price'],
                        'selling_price' => $item['selling_price'],
                        'image' => $item['image_path'] ?? $product->image,
                    ]);
                }

                StockMovement::create([
                    'business_id' => $user->business_id,
                    'product_id' => $product->id,
                    'user_id' => $user->id,
                    'movement_type' => 'stock_in',
                    'source' => 'manual_input',
                    'quantity' => $quantity,
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockBefore + $quantity,
                    'description' => 'Input stok manual',
                ]);

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'purchase_price' => (float) $product->purchase_price,
                    'selling_price' => (float) $product->selling_price,
                    'quantity_added' => $quantity,
                    'stock_after' => $stockBefore + $quantity,
                    'image_url' => $product->image === null
                        ? null
                        : Storage::disk('public')->url($product->image),
                ];
            })->all();
        });

        Storage::disk('public')->delete(array_unique($oldImages));
        $session->forget(self::DRAFT_KEY);
        $session->put(self::RECEIPT_KEY, $receipt);

        return $receipt;
    }

    public function clearDraft(Session $session): void
    {
        $items = $session->get(self::DRAFT_KEY, []);
        $paths = [];

        if (is_array($items)) {
            foreach ($items as $item) {
                if (is_array($item) && is_string($item['image_path'] ?? null)) {
                    $paths[] = $item['image_path'];
                }
            }
        }

        Storage::disk('public')->delete($paths);
        $session->forget(self::DRAFT_KEY);
    }
}
