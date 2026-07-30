<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminIndexRequest;
use App\Services\Admin\BusinessService;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    public function __invoke(AdminIndexRequest $request, BusinessService $service): Response
    {
        return Inertia::render('admin/list-business', $service->data($request->filters()));
    }
}
