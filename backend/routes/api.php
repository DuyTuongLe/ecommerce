<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Api\Admin\AdminMenuController;
use App\Http\Controllers\Api\Frontend\MenuController;
use App\Http\Controllers\Api\Admin\LanguageController;

Route::prefix('admin')->group(function () {

    Route::get(
        '/menus',
        [AdminMenuController::class, 'index']
    );

    Route::post(
        '/menus',
        [AdminMenuController::class, 'store']
    );

    Route::get(
        '/product-categories',
        [AdminMenuController::class, 'productCategories']
    );

    Route::post(
        '/menus/sort',
        [AdminMenuController::class, "sort"]
    );

    Route::delete(
        '/menus/{id}',
        [AdminMenuController::class, 'destroy']
    );
    
    Route::get(
        '/menu-groups',
        [AdminMenuController::class, 'groups']
    );

    Route::get(
        '/languages',
        [LanguageController::class, "index"]
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
