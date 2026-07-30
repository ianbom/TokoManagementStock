<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pos\StorePosCheckoutRequest;
use App\Models\Sale;
use App\Services\PosCartService;
use App\Services\PosCheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosCheckoutController extends Controller
{
    public function __construct(
        private readonly PosCartService $cartService,
        private readonly PosCheckoutService $checkoutService,
    ) {}

    public function create(Request $request): Response
    {
        abort_if($request->user()->business_id === null, 403);

        return Inertia::render('pos/checkout-confirmation', [
            'cart' => $this->cartService->summary($request->user(), $request->session()),
        ]);
    }

    public function store(StorePosCheckoutRequest $request): RedirectResponse
    {
        $sale = $this->checkoutService->checkout($request->user(), $request->validated(), $request->session());

        return to_route('pos.notification', $sale);
    }

    public function show(Request $request, Sale $sale): Response
    {
        abort_if($request->user()->business_id === null || $sale->business_id !== $request->user()->business_id, 403);

        $sale->load('items');

        return Inertia::render('pos/checkout-notification', [
            'sale' => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer_name,
                'notes' => $sale->notes,
                'completed_at' => $sale->completed_at,
                'total' => (float) $sale->total_amount,
                'items' => $sale->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
        ]);
    }
}
