<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Url;
use App\Models\Danduong;
use App\Models\DanduongNgonngu;
class Apicontroller extends Controller
{
    //
    public function getPage($slug)
    {
        $url = Url::where('slug', $slug)
            ->where('ngonngu', 'vi')
            ->first();

        if (!$url) {
            return response()->json(['error' => 'Not found'], 404);
        }

        if ($url->entity_type == 'danduong') {
            $danduong = Danduong::find($url->entity_id);

            $ngonngu = DanduongNgonngu::where('danduong_id', $danduong->id)
                ->where('ngonngu', 'vi')
                ->first();

            return response()->json([
                'type' => 'danduong',
                'data' => $danduong,
                'content' => $ngonngu
            ]);
        }

        return response()->json(['error' => 'Unsupported type']);
    }
}
