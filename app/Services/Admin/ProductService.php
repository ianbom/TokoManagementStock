<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Builder;

class ProductService extends AdminService
{
    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     * @return array<string, mixed>
     */
    public function data(array $filters): array
    {
        $current = $this->counts(Product::query());
        $previous = $this->previousCounts();
        $query = Product::query()
            ->join('businesses', 'businesses.id', '=', 'products.business_id')
            ->whereNull('businesses.deleted_at')
            ->select([
                'products.id',
                'products.name',
                'products.stock',
                'products.selling_price',
                'products.created_at',
                'businesses.name as business_name',
            ])
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $search = '%'.$filters['search'].'%';
                $query->where(function ($query) use ($search): void {
                    $query->where('products.name', 'like', $search)
                        ->orWhere('businesses.name', 'like', $search);
                });
            });

        $sorts = [
            'name' => 'products.name',
            'business' => 'businesses.name',
            'stock' => 'products.stock',
            'price' => 'products.selling_price',
            'status' => 'products.stock',
            'created_at' => 'products.created_at',
        ];
        $sort = $sorts[$filters['sort']] ?? $sorts['created_at'];
        $rows = $query
            ->orderBy($sort, $filters['direction'])
            ->orderBy('products.id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => 'PRD-'.str_pad((string) $product->id, 4, '0', STR_PAD_LEFT),
                'business' => $product->getAttribute('business_name'),
                'stock' => (int) $product->stock,
                'price' => (float) $product->selling_price,
                'status' => $this->status((int) $product->stock),
            ]);

        return [
            'summary' => [
                'total' => $this->metric($current['total'], $previous['total']),
                'available' => $this->metric($current['available'], $previous['available']),
                'low_stock' => $this->metric($current['low_stock'], $previous['low_stock']),
                'out_of_stock' => $this->metric($current['out_of_stock'], $previous['out_of_stock']),
            ],
            'rows' => $rows,
            'filters' => $filters,
        ];
    }

    /**
     * @param  Builder<Product>  $query
     * @return array{total: int, available: int, low_stock: int, out_of_stock: int}
     */
    private function counts(Builder $query): array
    {
        $counts = $query->selectRaw(
            'COUNT(*) as total, '.
            'SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END) as available, '.
            'SUM(CASE WHEN stock BETWEEN 1 AND 10 THEN 1 ELSE 0 END) as low_stock, '.
            'SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock'
        )->toBase()->first();
        $counts = (array) $counts;

        return [
            'total' => (int) ($counts['total'] ?? 0),
            'available' => (int) ($counts['available'] ?? 0),
            'low_stock' => (int) ($counts['low_stock'] ?? 0),
            'out_of_stock' => (int) ($counts['out_of_stock'] ?? 0),
        ];
    }

    /** @return array{total: int, available: int, low_stock: int, out_of_stock: int} */
    private function previousCounts(): array
    {
        $start = now()->startOfMonth();
        $deltas = StockMovement::query()
            ->where('created_at', '>=', $start)
            ->selectRaw("product_id, SUM(CASE WHEN movement_type = 'stock_in' THEN quantity ELSE -quantity END) as delta")
            ->groupBy('product_id');
        $stock = '(products.stock - COALESCE(month_movements.delta, 0))';
        $counts = Product::withTrashed()
            ->leftJoinSub($deltas, 'month_movements', 'month_movements.product_id', '=', 'products.id')
            ->where('products.created_at', '<', $start)
            ->where(fn ($query) => $query
                ->whereNull('products.deleted_at')
                ->orWhere('products.deleted_at', '>=', $start))
            ->selectRaw(
                'COUNT(*) as total, '.
                "SUM(CASE WHEN {$stock} > 10 THEN 1 ELSE 0 END) as available, ".
                "SUM(CASE WHEN {$stock} BETWEEN 1 AND 10 THEN 1 ELSE 0 END) as low_stock, ".
                "SUM(CASE WHEN {$stock} = 0 THEN 1 ELSE 0 END) as out_of_stock"
            )
            ->toBase()
            ->first();
        $counts = (array) $counts;

        return [
            'total' => (int) ($counts['total'] ?? 0),
            'available' => (int) ($counts['available'] ?? 0),
            'low_stock' => (int) ($counts['low_stock'] ?? 0),
            'out_of_stock' => (int) ($counts['out_of_stock'] ?? 0),
        ];
    }

    private function status(int $stock): string
    {
        return match (true) {
            $stock === 0 => 'out',
            $stock <= 10 => 'low',
            default => 'available',
        };
    }
}
