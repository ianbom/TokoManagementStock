<?php

namespace App\Services\Admin;

use App\Models\BusinessOrder;
use App\Models\Sale;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionService extends AdminService
{
    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     * @return array<string, mixed>
     */
    public function data(array $filters): array
    {
        $current = $this->summary(now()->startOfMonth(), now());
        $previousStart = now()->subMonthNoOverflow()->startOfMonth();
        $previous = $this->summary($previousStart, $previousStart->endOfMonth());
        $sales = DB::table('sales')
            ->join('businesses', 'businesses.id', '=', 'sales.business_id')
            ->whereNull('businesses.deleted_at')
            ->select([
                'sales.id',
                'sales.invoice_number as invoice',
                'businesses.name as business',
                DB::raw("'pos' as transaction_type"),
                'sales.total_amount as amount',
                'sales.status',
                'sales.created_at',
            ]);
        $orders = DB::table('business_orders')
            ->join('businesses', 'businesses.id', '=', 'business_orders.buyer_business_id')
            ->whereNull('businesses.deleted_at')
            ->select([
                'business_orders.id',
                'business_orders.order_number as invoice',
                'businesses.name as business',
                DB::raw("'supplier_purchase' as transaction_type"),
                'business_orders.total_amount as amount',
                'business_orders.status',
                'business_orders.created_at',
            ]);
        $query = DB::query()
            ->fromSub($sales->unionAll($orders), 'transactions')
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $search = '%'.$filters['search'].'%';
                $normalized = mb_strtolower($filters['search']);
                $type = match (true) {
                    str_contains($normalized, 'pembelian'), str_contains($normalized, 'supplier') => 'supplier_purchase',
                    str_contains($normalized, 'pos') => 'pos',
                    default => null,
                };
                $query->where(function ($query) use ($search, $type): void {
                    $query->where('invoice', 'like', $search)
                        ->orWhere('business', 'like', $search)
                        ->orWhere('transaction_type', 'like', $search);

                    if ($type !== null) {
                        $query->orWhere('transaction_type', $type);
                    }
                });
            });
        $sorts = [
            'invoice' => 'invoice',
            'business' => 'business',
            'type' => 'transaction_type',
            'amount' => 'amount',
            'status' => 'status',
            'occurredAt' => 'created_at',
            'created_at' => 'created_at',
        ];
        $sort = $sorts[$filters['sort']] ?? $sorts['created_at'];
        $rows = $query
            ->orderBy($sort, $filters['direction'])
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($transaction) => [
                'key' => $transaction->transaction_type.'-'.$transaction->id,
                'id' => $transaction->id,
                'invoice' => $transaction->invoice,
                'business' => $transaction->business,
                'type' => $transaction->transaction_type,
                'amount' => (float) $transaction->amount,
                'status' => $transaction->status,
                'occurredAt' => Carbon::parse($transaction->created_at)->toISOString(),
            ]);

        return [
            'summary' => [
                'total' => $this->metric($current['total'], $previous['total']),
                'completed' => $this->metric($current['completed'], $previous['completed']),
                'pending' => $this->metric($current['pending'], $previous['pending']),
                'value' => $this->metric($current['value'], $previous['value']),
            ],
            'rows' => $rows,
            'filters' => $filters,
        ];
    }

    /** @return array{total: int, completed: int, pending: int, value: float} */
    private function summary(CarbonInterface $start, CarbonInterface $end): array
    {
        $sales = Sale::query()->whereBetween('created_at', [$start, $end]);
        $orders = BusinessOrder::query()->whereBetween('created_at', [$start, $end]);

        return [
            'total' => (clone $sales)->count() + (clone $orders)->count(),
            'completed' => (clone $sales)->where('status', 'completed')->count()
                + (clone $orders)->where('status', 'completed')->count(),
            'pending' => (clone $sales)->where('status', 'pending')->count()
                + (clone $orders)->where('status', 'pending')->count(),
            'value' => (float) (clone $sales)->where('status', 'completed')->sum('total_amount')
                + (float) (clone $orders)->where('status', 'completed')->sum('total_amount'),
        ];
    }
}
