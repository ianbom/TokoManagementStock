<?php

namespace App\Services;

use App\Models\BusinessOrder;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class TransactionHistoryService
{
    /**
     * @param  array{search: string, type: string, period: string, sort: string}  $filters
     * @return array<string, mixed>
     */
    public function index(User $user, array $filters): array
    {
        $baseQuery = StockMovement::query()
            ->where('business_id', $user->business_id);

        $this->applySearch($baseQuery, $filters['search']);
        $this->applyPeriod($baseQuery, $filters['period']);

        $summary = [
            'total' => (clone $baseQuery)->count(),
            'stock_in' => (clone $baseQuery)->where('movement_type', 'stock_in')->count(),
            'stock_out' => (clone $baseQuery)->where('movement_type', 'stock_out')->count(),
        ];

        $transactions = $baseQuery
            ->with([
                'product:id,name,image',
                'sale:id,invoice_number,customer_name',
                'businessOrder:id,order_number,buyer_business_id,seller_business_id',
                'businessOrder.buyerBusiness:id,name',
                'businessOrder.sellerBusiness:id,name',
            ]);

        $this->applyType($transactions, $filters['type']);

        $transactions = $transactions
            ->orderBy('created_at', $filters['sort'] === 'oldest' ? 'asc' : 'desc')
            ->orderBy('id', $filters['sort'] === 'oldest' ? 'asc' : 'desc')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (StockMovement $movement): array => $this->listItem($movement));

        return [
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => $filters,
        ];
    }

    /** @return array<string, mixed> */
    public function detail(User $user, int $transactionId): array
    {
        $movement = StockMovement::query()
            ->where('business_id', $user->business_id)
            ->with([
                'product:id,name,image',
                'user:id,name',
                'sale.items:id,sale_id,product_name,quantity,price,subtotal',
                'businessOrder.items:id,business_order_id,product_name,quantity,price,subtotal',
                'businessOrder.buyerBusiness:id,name',
                'businessOrder.sellerBusiness:id,name',
            ])
            ->findOrFail($transactionId);

        return [
            ...$this->listItem($movement),
            'stock_before' => $movement->stock_before,
            'stock_after' => $movement->stock_after,
            'description' => $movement->description,
            'operator_name' => $movement->user?->name,
            'image_url' => $movement->product->image === null
                ? null
                : Storage::disk('public')->url($movement->product->image),
            'document' => $this->document($movement),
        ];
    }

    /** @param Builder<StockMovement> $query */
    private function applySearch(Builder $query, string $search): void
    {
        if ($search === '') {
            return;
        }

        $query->where(function (Builder $query) use ($search): void {
            $query
                ->where('description', 'like', "%{$search}%")
                ->orWhereHas('product', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
                ->orWhereHas('sale', fn (Builder $query) => $query
                    ->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%"))
                ->orWhereHas('businessOrder', fn (Builder $query) => $query
                    ->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('buyerBusiness', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('sellerBusiness', fn (Builder $query) => $query->where('name', 'like', "%{$search}%")));
        });
    }

    /** @param Builder<StockMovement> $query */
    private function applyPeriod(Builder $query, string $period): void
    {
        $start = match ($period) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            default => now()->startOfDay(),
        };

        $query->whereBetween('created_at', [$start, now()->endOfDay()]);
    }

    /** @param Builder<StockMovement> $query */
    private function applyType(Builder $query, string $type): void
    {
        match ($type) {
            'in' => $query->where('movement_type', 'stock_in')->where('source', 'manual_input'),
            'out' => $query->where('movement_type', 'stock_out'),
            'supplier' => $query->where('source', 'business_purchase'),
            default => null,
        };
    }

    /** @return array<string, mixed> */
    private function listItem(StockMovement $movement): array
    {
        return [
            'id' => $movement->id,
            'type' => $this->type($movement),
            'title' => $this->title($movement),
            'product_name' => $movement->product->name,
            'quantity' => $movement->quantity,
            'occurred_at' => $movement->created_at->toISOString(),
            'source_label' => $this->sourceLabel($movement),
        ];
    }

    private function type(StockMovement $movement): string
    {
        if ($movement->source === 'business_purchase') {
            return 'supplier';
        }

        return $movement->movement_type === 'stock_in' ? 'in' : 'out';
    }

    private function title(StockMovement $movement): string
    {
        return match ($movement->source) {
            'business_purchase' => 'Pembelian Supplier',
            'business_sale' => 'Penjualan Supplier',
            'pos_sale' => 'Stock Keluar',
            default => 'Stock Masuk',
        };
    }

    private function sourceLabel(StockMovement $movement): string
    {
        return match ($movement->source) {
            'pos_sale' => $movement->sale === null
                ? 'Penjualan toko'
                : "Penjualan {$movement->sale->invoice_number}",
            'business_purchase' => $movement->businessOrder?->sellerBusiness === null
                ? 'Pembelian supplier'
                : "Dibeli dari {$movement->businessOrder->sellerBusiness->name}",
            'business_sale' => $movement->businessOrder?->buyerBusiness === null
                ? 'Penjualan supplier'
                : "Dijual ke {$movement->businessOrder->buyerBusiness->name}",
            default => 'Input manual',
        };
    }

    /** @return array<string, mixed>|null */
    private function document(StockMovement $movement): ?array
    {
        return match ($movement->source) {
            'pos_sale' => $movement->sale === null ? null : $this->saleDocument($movement->sale),
            'business_purchase', 'business_sale' => $movement->businessOrder === null
                ? null
                : $this->orderDocument($movement->businessOrder, $movement->source),
            default => null,
        };
    }

    /** @return array<string, mixed> */
    private function saleDocument(Sale $sale): array
    {
        return [
            'kind' => 'sale',
            'number' => $sale->invoice_number,
            'customer_name' => $sale->customer_name,
            'notes' => $sale->notes,
            'status' => $sale->status,
            'completed_at' => $sale->completed_at === null
                ? null
                : Carbon::parse($sale->completed_at)->toISOString(),
            'total' => (float) $sale->total_amount,
            'items' => $sale->items->map(fn ($item): array => [
                'id' => $item->id,
                'name' => $item->product_name,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) $item->subtotal,
            ])->values(),
        ];
    }

    /** @return array<string, mixed> */
    private function orderDocument(BusinessOrder $order, string $source): array
    {
        $partner = $source === 'business_purchase'
            ? $order->sellerBusiness
            : $order->buyerBusiness;

        return [
            'kind' => 'business_order',
            'number' => $order->order_number,
            'partner_name' => $partner?->name,
            'notes' => $order->notes,
            'status' => $order->status,
            'completed_at' => $order->completed_at === null
                ? null
                : Carbon::parse($order->completed_at)->toISOString(),
            'total' => (float) $order->total_amount,
            'items' => $order->items->map(fn ($item): array => [
                'id' => $item->id,
                'name' => $item->product_name,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) $item->subtotal,
            ])->values(),
        ];
    }
}
