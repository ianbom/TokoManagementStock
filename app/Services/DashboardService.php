<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;

class DashboardService
{
    /** @return array<string, mixed> */
    public function data(User $user): array
    {
        if ($user->business_id === null) {
            return $this->emptyData();
        }

        $business = Business::query()
            ->select(['id', 'name', 'business_type'])
            ->find($user->business_id);

        if ($business === null) {
            return $this->emptyData();
        }

        $sales = Sale::query()
            ->where('business_id', $business->id)
            ->where('status', 'completed')
            ->whereBetween('completed_at', [now()->startOfMonth(), now()->endOfMonth()]);

        $income = (float) (clone $sales)->sum('total_amount');
        $expense = $this->costOfGoodsSold($business->id);

        return [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'type' => $business->business_type,
            ],
            'financial_summary' => [
                'income' => $income,
                'expense' => $expense,
                'gross_profit' => $income - $expense,
                'period_label' => 'Bulan Ini',
            ],
            'best_seller' => $this->bestSeller($business->id),
            'suppliers' => $this->latestSuppliers($business->id),
        ];
    }

    private function costOfGoodsSold(int $businessId): float
    {
        return (float) SaleItem::query()
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->where('sales.business_id', $businessId)
            ->where('sales.status', 'completed')
            ->whereBetween('sales.completed_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->selectRaw('COALESCE(SUM(sale_items.quantity * products.purchase_price), 0) as expense')
            ->value('expense');
    }

    /** @return array<string, int|string>|null */
    private function bestSeller(int $businessId): ?array
    {
        $item = SaleItem::query()
            ->select(['sale_items.product_id', 'sale_items.product_name'])
            ->selectRaw('SUM(sale_items.quantity) as quantity_sold')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->where('sales.business_id', $businessId)
            ->where('sales.status', 'completed')
            ->whereBetween('sales.completed_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->groupBy('sale_items.product_id', 'sale_items.product_name')
            ->orderByDesc('quantity_sold')
            ->orderBy('sale_items.product_name')
            ->first();

        if ($item === null) {
            return null;
        }

        return [
            'product_id' => $item->product_id,
            'name' => $item->product_name,
            'quantity_sold' => (int) $item->getAttribute('quantity_sold'),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    private function latestSuppliers(int $businessId): array
    {
        return Business::query()
            ->select(['id', 'name', 'business_category', 'address'])
            ->where('business_type', 'supplier')
            ->whereKeyNot($businessId)
            ->withCount('products')
            ->latest('created_at')
            ->latest('id')
            ->limit(3)
            ->get()
            ->map(fn (Business $supplier) => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'category' => $supplier->business_category ?: 'Supplier',
                'address' => $supplier->address,
                'products_count' => $supplier->products_count,
            ])
            ->all();
    }

    /** @return array<string, mixed> */
    private function emptyData(): array
    {
        return [
            'business' => null,
            'financial_summary' => [
                'income' => 0,
                'expense' => 0,
                'gross_profit' => 0,
                'period_label' => 'Bulan Ini',
            ],
            'best_seller' => null,
            'suppliers' => [],
        ];
    }
}
