<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ngonngu;

class LanguageController extends Controller
{
    //
    public function index()
    {
        $langs = Ngonngu::active()
            ->orderByDesc('macdinh')
            ->get(['code', 'name', 'macdinh']);

        return response()->json([
            'data' => $langs,
            'default' => optional($langs->firstWhere('macdinh', 1))->code
        ]);
    }
}
