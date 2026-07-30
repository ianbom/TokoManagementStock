<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pos\IndexPosRequest;
use App\Models\Product;
use App\Services\PosCartService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PosProductController extends Controller
{
    public function __construct(private readonly PosCartService $cartService) {}

    public function __invoke(IndexPosRequest $request): Response
    {
        $search = (string) $request->validated('search', '');
        $stock = (string) $request->validated('stock', 'all');

        $products = Product::query()
            ->where('business_id', $request->user()->business_id)
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($stock === 'available', fn ($query) => $query->where('stock', '>', 0))
            ->when($stock === 'low', fn ($query) => $query->whereBetween('stock', [1, 10]))
            ->when($stock === 'out', fn ($query) => $query->where('stock', 0))
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->selling_price,
                'stock' => $product->stock,
                'image_url' => $product->image === null ? null : Storage::disk('public')->url($product->image),
            ]);

        return Inertia::render('pos/pick-product', [
            'products' => $products,
            'filters' => compact('search', 'stock'),
            'available_product_count' => Product::query()
                ->where('business_id', $request->user()->business_id)
                ->where('stock', '>', 0)
                ->count(),
            'cart' => $this->cartService->summary($request->user(), $request->session()),
        ]);
    }
}
