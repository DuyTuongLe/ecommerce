<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Api\Admin\AdminMenuController;
use App\Http\Controllers\Api\Frontend\MenuController;

Route::prefix('admin')->group(function () {

    Route::get(
        '/menus',
        [AdminMenuController::class, 'index']
    );

    Route::get(
        '/product-categories',
        [AdminMenuController::class, 'productCategories']
    );

});

Route::prefix('menus')->group(function () {

    // Header menu
    Route::get(
        '/header',
        [MenuController::class, 'header']
    );

    // Product menu
    Route::get(
        '/product-menu',
        [MenuController::class, 'productMenu']
    );

});