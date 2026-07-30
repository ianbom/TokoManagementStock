<?php

namespace App\Services\Admin;

use App\Models\Business;
use App\Models\BusinessOrder;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class DashboardService extends AdminService
{
    public function __construct(private readonly BusinessService $businessService) {}

    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     * @return array<string, mixed>
     */
    public function data(array $filters): array
    {
        $start = now()->startOfMonth();
        $businesses = Business::query()->count();
        $users = User::query()->count();
        $products = Product::query()->count();
        $transactions = Sale::query()->whereBetween('created_at', [$start, now()])->count()
            + BusinessOrder::query()->whereBetween('created_at', [$start, now()])->count();
        $previousTransactionsStart = now()->subMonthNoOverflow()->startOfMonth();
        $previousTransactionsEnd = $previousTransactionsStart->endOfMonth();
        $previousTransactions = Sale::query()->whereBetween('created_at', [$previousTransactionsStart, $previousTransactionsEnd])->count()
            + BusinessOrder::query()->whereBetween('created_at', [$previousTransactionsStart, $previousTransactionsEnd])->count();

        return [
            'metrics' => [
                'total_businesses' => $this->metric($businesses, $this->previousCount('businesses', $start)),
                'total_users' => $this->metric($users, $this->previousCount('users', $start)),
                'total_products' => $this->metric($products, $this->previousCount('products', $start)),
                'transactions_this_month' => $this->metric($transactions, $previousTransactions),
            ],
            'growth' => $this->growth(),
            'businesses' => $this->businessService->rows($filters, 5),
            'filters' => $filters,
        ];
    }

    /** @return array<int, array{month: string, label: string, store: int, supplier: int}> */
    private function growth(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $growth = [];

        for ($offset = 11; $offset >= 0; $offset--) {
            $month = now()->startOfMonth()->subMonths($offset);
            $end = $month->isSameMonth(now()) ? now() : $month->endOfMonth();
            $counts = Business::query()
                ->where('created_at', '<=', $end)
                ->selectRaw(
                    "SUM(CASE WHEN business_type = 'store' THEN 1 ELSE 0 END) as stores, ".
                    "SUM(CASE WHEN business_type = 'supplier' THEN 1 ELSE 0 END) as suppliers"
                )
                ->toBase()
                ->first();
            $counts = (array) $counts;
            $growth[] = [
                'month' => $month->format('Y-m'),
                'label' => $months[$month->month - 1],
                'store' => (int) ($counts['stores'] ?? 0),
                'supplier' => (int) ($counts['suppliers'] ?? 0),
            ];
        }

        return $growth;
    }

    private function previousCount(string $table, CarbonInterface $start): int
    {
        return DB::table($table)
            ->where('created_at', '<', $start)
            ->where(fn ($query) => $query
                ->whereNull('deleted_at')
                ->orWhere('deleted_at', '>=', $start))
            ->count();
    }
}
