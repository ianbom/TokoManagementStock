<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('transactions/history', 'transactions/history')
        ->name('transactions.history');
    Route::inertia('chats', 'chats/list-chat')->name('chats.index');
    Route::inertia('stocks', 'stocks/list-stock')->name('stocks.index');
    Route::inertia('stocks/input-stock', 'stocks/input-stock')
        ->name('stocks.input');
    Route::inertia('stocks/stock-in-confirmation', 'stocks/stock-in-confirmation')
        ->name('stocks.confirmation');
    Route::inertia('stocks/stock-in-notification', 'stocks/stock-in-notification')
        ->name('stocks.notification');
});

require __DIR__.'/settings.php';
