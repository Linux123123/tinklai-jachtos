<?php

use Illuminate\Support\Facades\Route;

// Public yacht browsing routes
Route::get('/', [App\Http\Controllers\YachtController::class, 'index'])->name('home');
Route::get('yachts/{yacht}', [App\Http\Controllers\YachtController::class, 'show'])->name('yachts.show');

Route::middleware(['auth', 'verified'])->group(function () {
    // My yachts routes (for owners) - using resource controller
    Route::resource('my-yachts', App\Http\Controllers\Owner\YachtController::class)
        ->parameters(['my-yachts' => 'yacht'])
        ->names([
            'index' => 'my-yachts.index',
            'create' => 'my-yachts.create',
            'store' => 'my-yachts.store',
            'show' => 'my-yachts.show',
            'edit' => 'my-yachts.edit',
            'update' => 'my-yachts.update',
            'destroy' => 'my-yachts.destroy',
        ]);

    // Yacht pricing routes (for owners)
    Route::post('my-yachts/{yacht}/pricings', [App\Http\Controllers\Owner\YachtController::class, 'storePricing'])
        ->name('my-yachts.pricings.store');
    Route::put('my-yachts/{yacht}/pricings/{pricing}', [App\Http\Controllers\Owner\YachtController::class, 'updatePricing'])
        ->name('my-yachts.pricings.update');
    Route::delete('my-yachts/{yacht}/pricings/{pricing}', [App\Http\Controllers\Owner\YachtController::class, 'destroyPricing'])
        ->name('my-yachts.pricings.destroy');

    // Yacht image routes (for owners)
    Route::post('my-yachts/{yacht}/images', [App\Http\Controllers\Owner\YachtController::class, 'storeImages'])
        ->name('my-yachts.images.store');
    Route::delete('my-yachts/{yacht}/images/{image}', [App\Http\Controllers\Owner\YachtController::class, 'destroyImage'])
        ->name('my-yachts.images.destroy');
    Route::post('my-yachts/{yacht}/images/{image}/primary', [App\Http\Controllers\Owner\YachtController::class, 'setPrimaryImage'])
        ->name('my-yachts.images.primary');

    // Booking routes
    Route::get('yachts/{yacht}/book', [App\Http\Controllers\BookingController::class, 'create'])
        ->name('bookings.create');
    Route::post('yachts/{yacht}/book', [App\Http\Controllers\BookingController::class, 'store'])
        ->name('bookings.store');

    // My bookings routes
    Route::get('my-bookings', [App\Http\Controllers\BookingController::class, 'index'])
        ->name('my-bookings.index');
    Route::get('my-bookings/{booking}', [App\Http\Controllers\BookingController::class, 'show'])
        ->name('my-bookings.show');
    Route::post('my-bookings/{booking}/cancel', [App\Http\Controllers\BookingController::class, 'cancel'])
        ->name('my-bookings.cancel');

    // Owner booking management routes
    Route::prefix('owner')->name('owner.')->group(function () {
        Route::get('bookings', [App\Http\Controllers\Owner\BookingController::class, 'index'])
            ->name('bookings.index');
        Route::get('bookings/{booking}', [App\Http\Controllers\Owner\BookingController::class, 'show'])
            ->name('bookings.show');
        Route::post('bookings/{booking}/confirm', [App\Http\Controllers\Owner\BookingController::class, 'confirm'])
            ->name('bookings.confirm');
        Route::post('bookings/{booking}/reject', [App\Http\Controllers\Owner\BookingController::class, 'reject'])
            ->name('bookings.reject');
        Route::post('bookings/{booking}/complete', [App\Http\Controllers\Owner\BookingController::class, 'complete'])
            ->name('bookings.complete');
    });

    // Messages/Conversations routes
    Route::get('messages', [App\Http\Controllers\MessageController::class, 'index'])
        ->name('messages.index');
    Route::post('messages', [App\Http\Controllers\MessageController::class, 'store'])
        ->name('messages.store');
    Route::get('messages/{conversation}', [App\Http\Controllers\MessageController::class, 'show'])
        ->name('messages.show');
    Route::post('messages/{conversation}', [App\Http\Controllers\MessageController::class, 'storeMessage'])
        ->name('messages.send');
    Route::post('messages/{message}/read', [App\Http\Controllers\MessageController::class, 'markAsRead'])
        ->name('messages.read');
    Route::delete('messages/{message}', [App\Http\Controllers\MessageController::class, 'destroy'])
        ->name('messages.destroy');

    // Reviews routes
    Route::get('bookings/{booking}/review', [App\Http\Controllers\ReviewController::class, 'create'])
        ->name('reviews.create');
    Route::post('bookings/{booking}/review', [App\Http\Controllers\ReviewController::class, 'store'])
        ->name('reviews.store');
    Route::get('reviews/{review}', [App\Http\Controllers\ReviewController::class, 'show'])
        ->name('reviews.show');
    Route::delete('reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])
        ->name('reviews.destroy');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard.index');
        Route::get('statistics', [App\Http\Controllers\Admin\DashboardController::class, 'statistics'])
            ->name('statistics');

        // User management
        Route::resource('users', App\Http\Controllers\Admin\UserController::class);
        Route::post('users/{user}/toggle-block', [App\Http\Controllers\Admin\UserController::class, 'toggleBlock'])
            ->name('users.toggle-block');
        Route::post('users/{user}/assign-role', [App\Http\Controllers\Admin\UserController::class, 'assignRole'])
            ->name('users.assign-role');

        // Yacht management
        Route::resource('yachts', App\Http\Controllers\Admin\YachtController::class)
            ->only(['index', 'show', 'edit', 'update', 'destroy']);
        Route::post('yachts/{yacht}/update-status', [App\Http\Controllers\Admin\YachtController::class, 'updateStatus'])
            ->name('yachts.update-status');
    });
});

require __DIR__ . '/settings.php';
