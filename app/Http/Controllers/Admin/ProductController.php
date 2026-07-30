<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminIndexRequest;
use App\Services\Admin\ProductService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __invoke(AdminIndexRequest $request, ProductService $service): Response
    {
        return Inertia::render('admin/list-products', $service->data($request->filters()));
    }
}
