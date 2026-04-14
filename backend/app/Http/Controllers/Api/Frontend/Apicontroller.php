<?php

namespace App\Http\Controllers\Api\Frontend;

use Illuminate\Http\Request;
use App\Models\Url;
use App\Models\Danduong;
use App\Models\DanduongNgonngu;
use App\Http\Controllers\Controller;
class Apicontroller extends Controller
{
    //
    public function getMenu(Request $request)
    {
        $type = $request->get('type');
        $rootId = $request->get('root_id');
        $lang = $request->get('lang', 'vi');

        $query = Danduong::with([
            'ngonngu' => function ($q) use ($lang) {
                $q->where('ngonngu', $lang);
            },
            'url'
        ])
        ->where('trangthai', 1)
        ->orderBy('thutu');

        if ($type) {
            $query->where('type', $type);
        }

        $menus = $query->get();

        if ($rootId) {
            $menus = $this->filterByRoot($menus, $rootId);
        }

        return $this->formatMenu($menus);
    }

    private function filterByRoot($menus, $rootId)
    {
        $result = collect();

        $map = [];

        // build map id → children
        foreach ($menus as $item) {
            $parentId = $item->goc_id ?? 0;
            $map[$parentId][] = $item;
        }

        $collectChildren = function ($parentId) use (&$collectChildren, &$map, &$result) {
            if (!isset($map[$parentId])) return;

            foreach ($map[$parentId] as $child) {
                $result->push($child);
                $collectChildren($child->id);
            }
        };

        $root = $menus->where('id', $rootId)->first();

        if (!$root) {
            return collect();
        }
        if ($root) {
            $result->push($root);
            $collectChildren($rootId);
        }

        return $result;
    }

    private function formatMenu($menus)
    {
        return response()->json(
            $menus->map(function ($item) {

                $lang = $item->ngonngu->first();
                $url = $item->url->first();

                return [
                    'id' => $item->id,
                    'goc_id' => $item->goc_id,
                    'ten' => $lang->danduong_nn_ten ?? '',
                    'slug' => $url->slug ?? '',
                ];
            })
        );
    }
}
