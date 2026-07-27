<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transactions/history', 'transactions/history')
        ->name('transactions.history');
    Route::inertia('chats', 'chats/list-chat')->name('chats.index');
    Route::inertia('chats/chat', 'chats/chat')->name('chats.chat');
    Route::inertia('pos', 'pos/pick-product')->name('pos.index');
    Route::inertia('pos/checkout-confirmation', 'pos/checkout-confirmation')
        ->name('pos.checkout');
    Route::inertia('pos/checkout-notification', 'pos/checkout-notification')
        ->name('pos.notification');
    Route::inertia('suppliers', 'suppliers/list-supplier')
        ->name('suppliers.index');
    Route::inertia('suppliers/buy-product', 'suppliers/buy-product')
        ->name('suppliers.buy');
    Route::inertia('suppliers/checkout-confirmation', 'suppliers/checkout-confirmation')
        ->name('suppliers.checkout');
    Route::inertia('suppliers/checkout-notification', 'suppliers/checkout-notification')
        ->name('suppliers.notification');
    Route::inertia('stocks', 'stocks/list-stock')->name('stocks.index');
    Route::inertia('stocks/input-stock', 'stocks/input-stock')
        ->name('stocks.input');
    Route::inertia('stocks/stock-in-confirmation', 'stocks/stock-in-confirmation')
        ->name('stocks.confirmation');
    Route::inertia('stocks/stock-in-notification', 'stocks/stock-in-notification')
        ->name('stocks.notification');
});

require __DIR__.'/settings.php';
