<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserService extends AdminService
{
    /**
     * @param  array{search: string, sort: string, direction: 'asc'|'desc'}  $filters
     * @return array<string, mixed>
     */
    public function data(array $filters): array
    {
        $current = $this->counts(User::query());
        $start = now()->startOfMonth();
        $previous = $this->counts(User::withTrashed()
            ->where('users.created_at', '<', $start)
            ->where(fn ($query) => $query
                ->whereNull('users.deleted_at')
                ->orWhere('users.deleted_at', '>=', $start)));
        $query = User::query()
            ->leftJoin('businesses', 'businesses.id', '=', 'users.business_id')
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.role',
                'users.email_verified_at',
                'users.created_at',
                'businesses.name as business_name',
            ])
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $search = '%'.$filters['search'].'%';
                $query->where(function ($query) use ($search): void {
                    $query->where('users.name', 'like', $search)
                        ->orWhere('users.email', 'like', $search)
                        ->orWhere('businesses.name', 'like', $search);
                });
            });
        $sorts = [
            'name' => 'users.name',
            'email' => 'users.email',
            'role' => 'users.role',
            'business' => 'businesses.name',
            'status' => 'users.email_verified_at',
            'joinedAt' => 'users.created_at',
            'created_at' => 'users.created_at',
        ];
        $sort = $sorts[$filters['sort']] ?? $sorts['created_at'];
        $rows = $query
            ->orderBy($sort, $filters['direction'])
            ->orderBy('users.id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'business' => $user->business_name ?? 'StockFlow',
                'status' => $user->email_verified_at === null ? 'pending' : 'active',
                'joinedAt' => $user->created_at?->toISOString(),
            ]);

        return [
            'summary' => [
                'total' => $this->metric($current['total'], $previous['total']),
                'admins' => $this->metric($current['admins'], $previous['admins']),
                'stores' => $this->metric($current['stores'], $previous['stores']),
                'suppliers' => $this->metric($current['suppliers'], $previous['suppliers']),
            ],
            'rows' => $rows,
            'filters' => $filters,
        ];
    }

    /**
     * @param  Builder<User>  $query
     * @return array{total: int, admins: int, stores: int, suppliers: int}
     */
    private function counts(Builder $query): array
    {
        $counts = $query->selectRaw(
            'COUNT(*) as total, '.
            "SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins, ".
            "SUM(CASE WHEN role = 'store' THEN 1 ELSE 0 END) as stores, ".
            "SUM(CASE WHEN role = 'supplier' THEN 1 ELSE 0 END) as suppliers"
        )->toBase()->first();
        $counts = (array) $counts;

        return [
            'total' => (int) ($counts['total'] ?? 0),
            'admins' => (int) ($counts['admins'] ?? 0),
            'stores' => (int) ($counts['stores'] ?? 0),
            'suppliers' => (int) ($counts['suppliers'] ?? 0),
        ];
    }
}
