<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminIndexRequest;
use App\Services\Admin\UserService;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __invoke(AdminIndexRequest $request, UserService $service): Response
    {
        return Inertia::render('admin/list-users', $service->data($request->filters()));
    }
}
