<?php

namespace App\Services\Admin;

use App\Models\Business;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

class BusinessService extends AdminService
{
    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     * @return array<string, mixed>
     */
    public function data(array $filters): array
    {
        $start = now()->startOfMonth();
        $current = $this->typeCounts(Business::query());
        $previous = $this->typeCounts(Business::withTrashed()
            ->where('businesses.created_at', '<', $start)
            ->where(fn ($query) => $query
                ->whereNull('businesses.deleted_at')
                ->orWhere('businesses.deleted_at', '>=', $start)));
        $active = $this->activeQuery(now()->subDays(30), now())->count();
        $previousActive = $this->activeQuery(now()->subDays(60), now()->subDays(30))->count();

        return [
            'summary' => [
                'total' => $this->metric($current['total'], $previous['total']),
                'stores' => $this->metric($current['stores'], $previous['stores']),
                'suppliers' => $this->metric($current['suppliers'], $previous['suppliers']),
                'active' => $this->metric($active, $previousActive),
            ],
            'rows' => $this->rows($filters),
            'filters' => $filters,
        ];
    }

    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     */
    public function rows(array $filters, int $perPage = 15): mixed
    {
        $cutoff = now()->subDays(30);
        $query = Business::query()
            ->withCount(['users', 'products'])
            ->withCount([
                'sales as recent_sales_count' => fn ($query) => $query
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', $cutoff),
                'purchaseOrders as recent_purchases_count' => fn ($query) => $query
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', $cutoff),
                'salesOrders as recent_orders_count' => fn ($query) => $query
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', $cutoff),
            ])
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $search = '%'.$filters['search'].'%';
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', $search)
                        ->orWhere('code', 'like', $search)
                        ->orWhere('owner_name', 'like', $search)
                        ->orWhere('address', 'like', $search);
                });
            });
        $sorts = [
            'name' => 'name',
            'type' => 'business_type',
            'owner' => 'owner_name',
            'users' => 'users_count',
            'products' => 'products_count',
            'status' => 'recent_sales_count',
            'created_at' => 'created_at',
        ];
        $sort = $sorts[$filters['sort']] ?? $sorts['created_at'];

        return $query
            ->orderBy($sort, $filters['direction'])
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Business $business) => [
                'id' => $business->id,
                'code' => $business->code,
                'name' => $business->name,
                'type' => $business->business_type,
                'owner' => $business->owner_name,
                'address' => $business->address,
                'users' => $business->users_count,
                'products' => $business->products_count,
                'status' => ((int) $business->getAttribute('recent_sales_count')
                    + (int) $business->getAttribute('recent_purchases_count')
                    + (int) $business->getAttribute('recent_orders_count')) > 0 ? 'active' : 'inactive',
            ]);
    }

    /** @return Builder<Business> */
    private function activeQuery(CarbonInterface $start, CarbonInterface $end): Builder
    {
        return Business::query()->where(function ($query) use ($start, $end): void {
            $query->whereHas('sales', fn ($query) => $query
                ->where('status', 'completed')
                ->whereBetween('completed_at', [$start, $end]))
                ->orWhereHas('purchaseOrders', fn ($query) => $query
                    ->where('status', 'completed')
                    ->whereBetween('completed_at', [$start, $end]))
                ->orWhereHas('salesOrders', fn ($query) => $query
                    ->where('status', 'completed')
                    ->whereBetween('completed_at', [$start, $end]));
        });
    }

    /**
     * @param  Builder<Business>  $query
     * @return array{total: int, stores: int, suppliers: int}
     */
    private function typeCounts(Builder $query): array
    {
        $counts = $query->selectRaw(
            'COUNT(*) as total, '.
            "SUM(CASE WHEN business_type = 'store' THEN 1 ELSE 0 END) as stores, ".
            "SUM(CASE WHEN business_type = 'supplier' THEN 1 ELSE 0 END) as suppliers"
        )->toBase()->first();
        $counts = (array) $counts;

        return [
            'total' => (int) ($counts['total'] ?? 0),
            'stores' => (int) ($counts['stores'] ?? 0),
            'suppliers' => (int) ($counts['suppliers'] ?? 0),
        ];
    }
}
