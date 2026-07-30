<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosCartController;
use App\Http\Controllers\PosCheckoutController;
use App\Http\Controllers\PosProductController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\SupplierCartController;
use App\Http\Controllers\SupplierCheckoutController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SupplierProductController;
use App\Http\Controllers\TransactionHistoryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('transactions/history', [TransactionHistoryController::class, 'index'])
        ->name('transactions.history');
    Route::get('transactions/history/{transaction}', [TransactionHistoryController::class, 'show'])
        ->name('transactions.show');
    Route::get('chats', [ChatController::class, 'index'])->name('chats.index');
    Route::get('chats/partners', [ChatController::class, 'partners'])->name('chats.partners');
    Route::post('chats/{business}/start', [ChatController::class, 'store'])->name('chats.store');
    Route::post('chats/{conversation}/messages', [ChatMessageController::class, 'store'])
        ->name('chats.messages.store');
    Route::get('chats/{conversation}', [ChatController::class, 'show'])->name('chats.show');
    Route::get('pos', PosProductController::class)->name('pos.index');
    Route::post('pos/cart', [PosCartController::class, 'store'])->name('pos.cart.store');
    Route::patch('pos/cart/{product}', [PosCartController::class, 'update'])->name('pos.cart.update');
    Route::delete('pos/cart/{product}', [PosCartController::class, 'destroy'])->name('pos.cart.destroy');
    Route::get('pos/checkout-confirmation', [PosCheckoutController::class, 'create'])->name('pos.checkout');
    Route::post('pos/checkout', [PosCheckoutController::class, 'store'])->name('pos.checkout.store');
    Route::get('pos/checkout-notification/{sale}', [PosCheckoutController::class, 'show'])->name('pos.notification');
    Route::get('suppliers', [SupplierController::class, 'index'])
        ->name('suppliers.index');
    Route::get('suppliers/{supplier}/products', SupplierProductController::class)
        ->name('suppliers.buy');
    Route::post('suppliers/{supplier}/cart', [SupplierCartController::class, 'store'])
        ->name('suppliers.cart.store');
    Route::patch('suppliers/{supplier}/cart/{product}', [SupplierCartController::class, 'update'])
        ->name('suppliers.cart.update');
    Route::delete('suppliers/{supplier}/cart/{product}', [SupplierCartController::class, 'destroy'])
        ->name('suppliers.cart.destroy');
    Route::get('suppliers/{supplier}/checkout', [SupplierCheckoutController::class, 'create'])
        ->name('suppliers.checkout');
    Route::post('suppliers/{supplier}/checkout', [SupplierCheckoutController::class, 'store'])
        ->name('suppliers.checkout.store');
    Route::get('suppliers/orders/{businessOrder}', [SupplierCheckoutController::class, 'show'])
        ->name('suppliers.notification');
    Route::prefix('stocks')->name('stocks.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::patch('{product}', [StockController::class, 'update'])->name('update');
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
