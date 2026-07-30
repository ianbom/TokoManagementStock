<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Services\SupplierCartService;
use App\Services\SupplierCheckoutService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierCheckoutController extends Controller
{
    public function __construct(
        private readonly SupplierCartService $cartService,
        private readonly SupplierCheckoutService $checkoutService,
    ) {}

    public function create(Request $request, Business $supplier): Response|RedirectResponse
    {
        $this->cartService->ensurePurchasableSupplier($request->user(), $supplier);
        $cart = $this->cartService->summary($request->user(), $supplier, $request->session());

        if ($cart['items'] === []) {
            return to_route('suppliers.buy', $supplier)
                ->withErrors(['cart' => 'Keranjang supplier masih kosong.']);
        }

        return Inertia::render('suppliers/checkout-confirmation', [
            'supplier' => $this->supplierData($supplier),
            'cart' => $cart,
        ]);
    }

    public function store(Request $request, Business $supplier): RedirectResponse
    {
        abort_if($request->user()->business_id === null, 403);
        $order = $this->checkoutService->checkout($request->user(), $supplier, $request->session());

        return to_route('suppliers.notification', $order);
    }

    public function show(Request $request, BusinessOrder $businessOrder): Response
    {
        abort_if(
            $request->user()->business_id === null
            || $businessOrder->buyer_business_id !== $request->user()->business_id,
            403,
        );

        $businessOrder->load([
            'sellerBusiness:id,name,address,business_category',
            'items:id,business_order_id,product_name,quantity,price,subtotal',
        ]);

        return Inertia::render('suppliers/checkout-notification', [
            'order' => [
                'id' => $businessOrder->id,
                'order_number' => $businessOrder->order_number,
                'status' => $businessOrder->status,
                'completed_at' => $businessOrder->completed_at === null
                    ? null
                    : Carbon::parse($businessOrder->completed_at)->toIso8601String(),
                'total' => (float) $businessOrder->total_amount,
                'supplier' => $this->supplierData($businessOrder->sellerBusiness),
                'items' => $businessOrder->items->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ])->values(),
            ],
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
