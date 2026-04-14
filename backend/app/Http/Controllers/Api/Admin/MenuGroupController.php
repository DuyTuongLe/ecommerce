<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DanduongNhom;

class MenuGroupController extends Controller
{
    //
    public function index()
    {
        $data = DanduongNhom::select('id', 'danduong_nhom_tieude')->get();
        
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
