<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminIndexRequest;
use App\Services\Admin\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(AdminIndexRequest $request, DashboardService $service): Response
    {
        return Inertia::render('admin/dashboard', $service->data($request->filters()));
    }
}
