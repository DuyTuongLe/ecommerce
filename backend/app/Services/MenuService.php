<?php

// app/Services/MenuService.php

namespace App\Services;

use App\Models\Danduong;
use App\Models\DanduongNhom;

class MenuService
{
    private function baseQuery($lang = 'vi')
    {
        return Danduong::query()
            ->with([
                'group',
                'ngonngus' => function ($query) use ($lang) {
                    $query->where('ngonngu', $lang);
                },

                'urls' => function ($query) use ($lang) {
                    $query->where('ngonngu', $lang);
                }
            ]);
    }

    public function getMenuGroups()
    {
        return DanduongNhom::query()
        ->orderBy('id')
        ->get();
    }

    public function getAdminMenus($lang = 'vi', $groupId = null)
    {
        $query = $this->baseQuery($lang);
        if ($groupId) {

            $query->where(
                'danduong_nhom_id',
                $groupId
            );
        }
        return $query
            ->orderBy('goc_id')
            ->orderBy('thutu')
            ->get();
    }

    public function getProductCategories($lang = 'vi')
    {
        return $this->baseQuery($lang)
            ->whereIn('type', [
                'menu_group',
                'product_category'
            ])
            ->orderBy('goc_id')
            ->orderBy('thutu')
            ->get();
    }

    public function getHeaderMenu($lang = 'vi')
    {
        $menus = $this->baseQuery($lang)
            ->where('trangthai', 1)
            ->orderBy('thutu')
            ->get();

        return $this->buildTree($menus);
    }

    public function getFrontendProductMenu($lang = 'vi')
    {
        $menus = $this->baseQuery($lang)

            ->where('trangthai', 1)

            ->whereIn('type', [
                'menu_group',
                'product_category'
            ])

            ->orderBy('thutu')

            ->get();

        return $this->buildTree(
            $menus
        );
    }

    private function buildTree($items, $parentId = null)
    {
        $branch = [];

        foreach ($items as $item) {

            if ($item->goc_id == $parentId) {

                $children = $this->buildTree(
                    $items,
                    $item->id
                );

                $item->children = $children;

                $branch[] = $item;
            }
        }

        return $branch;
    }
}
