<?php

namespace App\Http\Controllers;

use App\Http\Requests\Stocks\StoreStockInDraftRequest;
use App\Http\Requests\Stocks\StoreStockInRequest;
use App\Services\StockInService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockInController extends Controller
{
    public function __construct(private readonly StockInService $stockInService) {}

    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->business_id === null) {
            return to_route('profile.edit');
        }

        return Inertia::render('stocks/input-stock');
    }

    public function addDraft(StoreStockInDraftRequest $request): RedirectResponse
    {
        $this->stockInService->addDraft(
            $request->user(),
            $request->safe()->except('image'),
            $request->file('image'),
            $request->session(),
        );

        return to_route('stocks.confirmation');
    }

    public function confirmation(Request $request): Response|RedirectResponse
    {
        $products = $request->session()->get(StockInService::DRAFT_KEY, []);

        if ($products === []) {
            return to_route('stocks.input');
        }

        return Inertia::render('stocks/stock-in-confirmation', compact('products'));
    }

    public function store(StoreStockInRequest $request): RedirectResponse
    {
        $this->stockInService->store(
            $request->user(),
            $request->validated('items'),
            $request->session(),
        );

        return to_route('stocks.notification');
    }

    public function destroyDraft(Request $request): RedirectResponse
    {
        $this->stockInService->clearDraft($request->session());

        return to_route('dashboard');
    }

    public function notification(Request $request): Response|RedirectResponse
    {
        $products = $request->session()->get(StockInService::RECEIPT_KEY, []);

        if ($products === []) {
            return to_route('stocks.index');
        }

        return Inertia::render('stocks/stock-in-notification', compact('products'));
    }

    public function finish(Request $request): RedirectResponse
    {
        $request->session()->forget(StockInService::RECEIPT_KEY);

        return to_route('dashboard');
    }
}
