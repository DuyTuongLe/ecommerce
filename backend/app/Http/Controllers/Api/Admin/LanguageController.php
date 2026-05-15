<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NgonNgu;

class LanguageController extends Controller
{
    //
    public function index() 
    {
        $languages = NgonNgu::query()
        ->where('status', 1)
        ->orderByDesc('macdinh')
        ->orderBy('id')
        ->get();
        return response()->json($languages);
    }
}
