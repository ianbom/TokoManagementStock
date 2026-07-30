<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transactions\IndexTransactionHistoryRequest;
use App\Services\TransactionHistoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionHistoryController extends Controller
{
    public function __construct(private readonly TransactionHistoryService $historyService) {}

    public function index(IndexTransactionHistoryRequest $request): Response
    {
        $filters = [
            'search' => trim((string) $request->validated('search', '')),
            'type' => (string) $request->validated('type', 'all'),
            'period' => (string) $request->validated('period', 'today'),
            'sort' => (string) $request->validated('sort', 'latest'),
        ];

        return Inertia::render(
            'transactions/history',
            $this->historyService->index($request->user(), $filters),
        );
    }

    public function show(Request $request, int $transaction): JsonResponse
    {
        abort_if($request->user()->business_id === null, 403);

        return response()->json([
            'transaction' => $this->historyService->detail($request->user(), $transaction),
        ]);
    }
}
