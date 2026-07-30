<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminIndexRequest;
use App\Services\Admin\TransactionService;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __invoke(AdminIndexRequest $request, TransactionService $service): Response
    {
        return Inertia::render('admin/list-transaction', $service->data($request->filters()));
    }
}
