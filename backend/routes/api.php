<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Api\Admin\AdminMenuController;
use App\Http\Controllers\Api\Frontend\MenuController;
use App\Http\Controllers\Api\Admin\LanguageController;
use App\Http\Controllers\Api\Admin\MediaController;

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

    Route::get(
        '/media',
        [MediaController::class, 'index']
    );

    Route::post(
        '/media-folders',
        [MediaController::class, 'storeFolder']
    );

    Route::put(
        '/media-folders/{id}',
        [MediaController::class, 'updateFolder']
    );

    Route::delete(
        '/media-folders/{id}',
        [MediaController::class, 'destroyFolder']
    );

    Route::post(
    '/media/upload',
    [MediaController::class,'upload']
);

Route::delete(
    '/media/{id}',
    [MediaController::class, 'destroyMedia']
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
