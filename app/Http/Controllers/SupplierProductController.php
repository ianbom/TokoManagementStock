<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Product;
use App\Services\SupplierCartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SupplierProductController extends Controller
{
    public function __construct(private readonly SupplierCartService $cartService) {}

    public function __invoke(Request $request, Business $supplier): Response
    {
        $this->cartService->ensurePurchasableSupplier($request->user(), $supplier);
        $validated = $request->validate(['search' => ['nullable', 'string', 'max:100']]);
        $search = trim((string) ($validated['search'] ?? ''));

        $products = Product::query()
            ->select(['id', 'business_id', 'name', 'stock', 'selling_price', 'image'])
            ->where('business_id', $supplier->id)
            ->where('stock', '>', 0)
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock,
                'price' => (float) $product->selling_price,
                'image_url' => $product->image === null ? null : Storage::disk('public')->url($product->image),
            ]);

        return Inertia::render('suppliers/buy-product', [
            'supplier' => $this->supplierData($supplier),
            'products' => $products,
            'cart' => $this->cartService->summary($request->user(), $supplier, $request->session()),
            'filters' => ['search' => $search],
        ]);
    }

    /** @return array<string, int|string|null> */
    private function supplierData(Business $supplier): array
    {
        return [
            'id' => $supplier->id,
            'name' => $supplier->name,
            'category' => $supplier->business_category,
            'address' => $supplier->address,
        ];
    }
}
