<?php

namespace App\Http\Controllers;

use App\Http\Requests\Suppliers\StoreSupplierCartItemRequest;
use App\Http\Requests\Suppliers\UpdateSupplierCartItemRequest;
use App\Models\Business;
use App\Models\Product;
use App\Services\SupplierCartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SupplierCartController extends Controller
{
    public function __construct(private readonly SupplierCartService $cartService) {}

    public function store(StoreSupplierCartItemRequest $request, Business $supplier): RedirectResponse
    {
        $this->cartService->add(
            $request->user(),
            $supplier,
            $request->integer('product_id'),
            $request->integer('quantity'),
            $request->session(),
        );

        return back();
    }

    public function update(UpdateSupplierCartItemRequest $request, Business $supplier, Product $product): RedirectResponse
    {
        $this->cartService->update(
            $request->user(),
            $supplier,
            $product,
            $request->integer('quantity'),
            $request->session(),
        );

        return back();
    }

    public function destroy(Request $request, Business $supplier, Product $product): RedirectResponse
    {
        abort_if($request->user()->business_id === null, 403);
        $this->cartService->remove($request->user(), $supplier, $product, $request->session());

        return back();
    }
}
