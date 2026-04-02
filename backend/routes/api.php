<?php
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ApiController;

Route::get('/check-db', function () {
    try {
        DB::connection()->getPdo();
        return "Kết nối DB OK";
    } catch (\Exception $e) {
        return "Lỗi: " . $e->getMessage();
    }
});
Route::get('/page/{slug}', [ApiController::class, 'getPage']);
