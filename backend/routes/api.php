<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Http\Controllers\Api\Admin\AdminMenuController;
use App\Http\Controllers\Api\Frontend\MenuController;
use App\Http\Controllers\Api\Admin\LanguageController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\BrandController;
use App\Http\Controllers\Api\Admin\AttributeController;
use App\Http\Controllers\Api\Admin\AttributeValueController;
use App\Http\Controllers\Api\Admin\ProductFormOptionsController;

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
        [MediaController::class, 'upload']
    );

    Route::put(
        '/media/{id}',
        [MediaController::class, 'update']
    );

    Route::delete(
        '/media/{id}',
        [MediaController::class, 'destroyMedia']
    );

    Route::post(
        '/media/move',
        [MediaController::class, 'moveMedia']
    );

    Route::post(
        '/media-folders/move',
        [MediaController::class, 'moveFolder']
    );

    Route::get(
        '/brands',
        [BrandController::class, 'index']
    );

    Route::post(
        '/brands',
        [BrandController::class, 'store']
    );

    Route::post(
        '/brands/bulk-delete',
        [BrandController::class, 'bulkDelete']
    );

    Route::post(
        '/brands/bulk-save',
        [BrandController::class, 'bulkSave']
    );

    Route::get(
        '/attributes',
        [AttributeController::class, 'index']
    );

    Route::get(
        '/attributevalues',
        [AttributeValueController::class, 'index']
    );

    Route::post(
        '/attributes',
        [AttributeController::class, 'store']
    );

    Route::post(
        '/attributes/bulk-save',
        [AttributeController::class, 'bulkSave']
    );

    Route::post(
        '/attributes/bulk-delete',
        [AttributeController::class, 'bulkDelete']
    );

    Route::post(
        '/attributevalues',
        [AttributeValueController::class, 'store']
    );

    Route::post(
        '/attributevalues/bulk-save',
        [AttributeValueController::class, 'bulkSave']
    );

    Route::post(
        '/attributevalues/bulk-delete',
        [AttributeValueController::class, 'bulkDelete']
    );

    Route::get(
        '/product-form-options',
        [ProductFormOptionsController::class, 'index']
    );

    Route::put(
        '/products/{product}',
        [ProductController::class, 'update']
    );

    Route::post(
        '/products',
        [ProductController::class, 'store']
    );

    Route::get(
        '/products',
        [ProductController::class, 'index']
    );

    Route::get(
        '/products/{id}',
        [ProductController::class, 'show']
    );

    Route::post(
        '/products/bulk-status',
        [ProductController::class, 'bulkStatus']
    );

    Route::post(
        '/products/bulk-delete',
        [ProductController::class, 'bulkDelete']
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
