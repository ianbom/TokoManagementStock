<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pos\StorePosCartItemRequest;
use App\Http\Requests\Pos\UpdatePosCartItemRequest;
use App\Models\Product;
use App\Services\PosCartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PosCartController extends Controller
{
    public function __construct(private readonly PosCartService $cartService) {}

    public function store(StorePosCartItemRequest $request): RedirectResponse
    {
        $this->cartService->add(
            $request->user(),
            $request->integer('product_id'),
            $request->integer('quantity'),
            $request->session(),
        );

        return back();
    }

    public function update(UpdatePosCartItemRequest $request, Product $product): RedirectResponse
    {
        $this->cartService->update($request->user(), $product, $request->integer('quantity'), $request->session());

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        abort_if($request->user()->business_id === null, 403);
        $this->cartService->remove($request->user(), $product, $request->session());

        return back();
    }
}
