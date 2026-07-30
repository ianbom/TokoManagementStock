<?php

namespace App\Http\Controllers;

use App\Http\Requests\Stocks\UpdateStockProductRequest;
use App\Models\Product;
use App\Services\StockProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(Request $request): Response
    {
        $businessId = $request->user()->business_id;
        $productsQuery = Product::query()
            ->select(['id', 'business_id', 'name', 'stock', 'purchase_price', 'selling_price', 'image'])
            ->when($businessId, fn ($query) => $query->where('business_id', $businessId), fn ($query) => $query->whereRaw('1 = 0'));

        $summary = [
            'total_products' => (clone $productsQuery)->count(),
            'total_stock' => (int) (clone $productsQuery)->sum('stock'),
            'low_stock' => (clone $productsQuery)->whereBetween('stock', [1, 10])->count(),
        ];

        $products = $productsQuery
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock,
                'purchase_price' => (float) $product->purchase_price,
                'selling_price' => (float) $product->selling_price,
                'image' => $product->image,
            ]);

        return Inertia::render('stocks/list-stock', [
            'products' => $products,
            'summary' => $summary,
        ]);
    }

    public function update(
        UpdateStockProductRequest $request,
        Product $product,
        StockProductService $stockProductService,
    ): RedirectResponse {
        $stockProductService->update(
            $request->user(),
            $product,
            $request->safe()->except('image'),
            $request->file('image'),
        );

        return back();
    }
}
