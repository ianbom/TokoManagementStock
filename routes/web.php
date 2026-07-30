<?php

use App\Http\Controllers\PosCartController;
use App\Http\Controllers\PosCheckoutController;
use App\Http\Controllers\PosProductController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\TransactionHistoryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('transactions/history', [TransactionHistoryController::class, 'index'])
        ->name('transactions.history');
    Route::get('transactions/history/{transaction}', [TransactionHistoryController::class, 'show'])
        ->name('transactions.show');
    Route::inertia('chats', 'chats/list-chat')->name('chats.index');
    Route::inertia('chats/chat', 'chats/chat')->name('chats.chat');
    Route::get('pos', PosProductController::class)->name('pos.index');
    Route::post('pos/cart', [PosCartController::class, 'store'])->name('pos.cart.store');
    Route::patch('pos/cart/{product}', [PosCartController::class, 'update'])->name('pos.cart.update');
    Route::delete('pos/cart/{product}', [PosCartController::class, 'destroy'])->name('pos.cart.destroy');
    Route::get('pos/checkout-confirmation', [PosCheckoutController::class, 'create'])->name('pos.checkout');
    Route::post('pos/checkout', [PosCheckoutController::class, 'store'])->name('pos.checkout.store');
    Route::get('pos/checkout-notification/{sale}', [PosCheckoutController::class, 'show'])->name('pos.notification');
    Route::inertia('suppliers', 'suppliers/list-supplier')
        ->name('suppliers.index');
    Route::inertia('suppliers/buy-product', 'suppliers/buy-product')
        ->name('suppliers.buy');
    Route::inertia('suppliers/checkout-confirmation', 'suppliers/checkout-confirmation')
        ->name('suppliers.checkout');
    Route::inertia('suppliers/checkout-notification', 'suppliers/checkout-notification')
        ->name('suppliers.notification');
    Route::prefix('stocks')->name('stocks.')->group(function () {
        Route::inertia('/', 'stocks/list-stock')->name('index');
        Route::get('input-stock', [StockInController::class, 'create'])->name('input');
        Route::post('input-stock', [StockInController::class, 'addDraft'])->name('draft.store');
        Route::get('stock-in-confirmation', [StockInController::class, 'confirmation'])
            ->name('confirmation');
        Route::post('stock-in', [StockInController::class, 'store'])->name('store');
        Route::delete('stock-in-draft', [StockInController::class, 'destroyDraft'])
            ->name('draft.destroy');
        Route::get('stock-in-notification', [StockInController::class, 'notification'])
            ->name('notification');
        Route::post('stock-in-notification/finish', [StockInController::class, 'finish'])
            ->name('notification.finish');
    });
});

require __DIR__.'/settings.php';
