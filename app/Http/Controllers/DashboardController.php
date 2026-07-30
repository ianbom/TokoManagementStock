<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->role === 'admin') {
            return to_route('admin.dashboard');
        }

        return Inertia::render('dashboard', $this->dashboardService->data($request->user()));
    }
}
