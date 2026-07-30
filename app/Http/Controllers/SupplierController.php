<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $suppliers = Business::query()
            ->select(['id', 'code', 'name', 'business_category', 'address', 'phone'])
            ->where('business_type', 'supplier')
            ->when($request->user()->business_id, fn ($query, $businessId) => $query->whereKeyNot($businessId))
            ->withCount('products')
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (Business $supplier) => [
                'id' => $supplier->id,
                'code' => $supplier->code,
                'name' => $supplier->name,
                'category' => $supplier->business_category ?: 'Supplier',
                'address' => $supplier->address,
                'phone' => $supplier->phone,
                'products_count' => $supplier->products_count,
            ]);

        return Inertia::render('suppliers/list-supplier', ['suppliers' => $suppliers]);
    }
}
