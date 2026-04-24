<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\Frontend\ApiController;
use App\Http\Controllers\Api\Admin\MenuController;
use App\Http\Controllers\Api\Admin\MenuGroupController;
use App\Http\Controllers\Api\Admin\LanguageController;

Route::get('/check-db', function () {
    try {
        DB::connection()->getPdo();
        return "Kết nối DB OK";
    } catch (\Exception $e) {
        return "Lỗi: " . $e->getMessage();
    }
});
Route::get('/page/{slug}', [ApiController::class, 'getPage']);
Route::get('/menu', [ApiController::class, 'getMenu']);



Route::prefix('admin')->group(function () {

    Route::get('/menu', [MenuController::class, 'index']);
    Route::post('/menu', [MenuController::class, 'store']);
    Route::put('/menu/{id}', [MenuController::class, 'update']);
    Route::delete('/menu/{id}', [MenuController::class, 'destroy']);
    Route::post('/menu/reorder', [MenuController::class, 'reorder']);

});
Route::get('/admin/menu-group', [MenuGroupController::class, 'index']);
Route::get('/languages', [LanguageController::class, 'index']);