<?php

// app/Services/MenuService.php

namespace App\Services;

use App\Models\Danduong;
use App\Models\DanduongNhom;
use App\Models\DanduongNgonngu;
use App\Models\Url;

use App\Services\SlugService;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuService
{
    private function baseQuery($lang = 'vi')
    {
        return Danduong::query()
            ->with([
                'group',
                'thumbnail',
                'ngonngus',

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
        $menu = $query
            ->orderBy('goc_id')
            ->orderBy('thutu')
            ->get();
        return $this->buildTree($menu);
    }

    public function sortMenus($items)
    {
        foreach ($items as $item) {
            Danduong::where(
                "id",
                $item["id"]
            )

                ->update([
                    "goc_id" => $item["goc_id"],
                    "thutu" => $item["thutu"]
                ]);
        }
    }

    public function getProductCategories(
        $lang = 'vi'
    ) {
        $items = Danduong::query()

            ->leftJoin(
                'danduong_ngonngu',
                function ($join) use ($lang) {

                    $join
                        ->on(
                            'danduong.id',
                            '=',
                            'danduong_ngonngu.danduong_id'
                        )
                        ->where(
                            'danduong_ngonngu.ngonngu',
                            $lang
                        );
                }
            )

            ->whereIn(
                'danduong.type',
                [
                    'menu_group',
                    'product_category'
                ]
            )

            ->select([
                'danduong.id',
                'danduong.goc_id',
                'danduong.type',

                'danduong_ngonngu.danduong_nn_ten as name'
            ])

            ->orderBy('danduong.goc_id')
            ->orderBy('danduong.thutu')

            ->get();

        return $this->buildTree(
            $items
        );
    }

    public function getDescendantIds($categoryId)
    {
        $allCategories = Danduong::query()
            ->select(
                'id',
                'goc_id'
            )
            ->get();

        return $this->collectDescendantIds(
            $categoryId,
            $allCategories
        );
    }

    private function collectDescendantIds(
        $categoryId,
        $allCategories
    ) {
        $ids = [$categoryId];

        $children = $allCategories
            ->where(
                'goc_id',
                $categoryId
            );

        foreach ($children as $child) {

            $ids = array_merge(
                $ids,
                $this->collectDescendantIds(
                    $child->id,
                    $allCategories
                )
            );
        }

        return $ids;
    }

    public function saveMenu($data)
    {
        DB::beginTransaction();

        try {

            if (!empty($data['id'])) {

                $menu = Danduong::findOrFail(
                    $data['id']
                );

                $menu->update([

                    'goc_id' => $data['goc_id'] ?? null,

                    'danduong_nhom_id' =>
                    $data['danduong_nhom_id'],

                    'type' =>
                    $data['type'],

                    'thumbnail_id' =>
                    $data['thumbnail_id'] ?? null,

                    'target' =>
                    $data['target'] ?? '_self',

                    'trangthai' =>
                    $data['trangthai'] ?? 1,

                ]);
            } else {
                $maxSort = Danduong::query()

                    ->where(
                        'goc_id',
                        $data['goc_id'] ?? null
                    )

                    ->max('thutu');

                $nextSort = ($maxSort ?? 0) + 1;

                $menu = Danduong::create([

                    'goc_id' => $data['goc_id'] ?? null,

                    'danduong_nhom_id' =>
                    $data['danduong_nhom_id'],

                    'type' =>
                    $data['type'],

                    'thumbnail_id' =>
                    $data['thumbnail_id'] ?? null,

                    'target' =>
                    $data['target'] ?? '_self',

                    'trangthai' =>
                    $data['trangthai'] ?? 1,

                    'thutu' => $nextSort

                ]);
            }

            if ($data['type'] !== 'external') {

                $slug = SlugService::generate([

                    'text' => $data['slug'],

                    'entity_type' => 'danduong',

                    'entity_id' => $menu->id,

                    'ngonngu' => $data['ngonngu']

                ]);

                Url::updateOrCreate(

                    [

                        'entity_type' => 'danduong',

                        'entity_id' => $menu->id,

                        'ngonngu' => $data['ngonngu']

                    ],

                    [

                        'slug' => $slug

                    ]

                );
            }
            /*
        |--------------------------------------------------------------------------
        | TRANSLATION
        |--------------------------------------------------------------------------
        */

            DanduongNgonngu::updateOrCreate(

                [

                    'danduong_id' =>
                    $menu->id,

                    'ngonngu' =>
                    $data['ngonngu']

                ],

                [

                    'danduong_nn_ten' =>
                    $data['danduong_nn_ten'] ?? null,

                    'mota' =>
                    $data['mota'] ?? null,

                    'seo_title' =>
                    $data['seo_title'] ?? null,

                    'seo_description' =>
                    $data['seo_description'] ?? null,

                    'seo_keywords' =>
                    $data['seo_keywords'] ?? null,

                    'external_url' =>
                    $data['external_url'] ?? null,

                ]

            );

            DB::commit();

            return [

                'success' => true,

                'id' => $menu->id

            ];
        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;
        }
    }

    public function deleteMenu($id)
    {
        DB::beginTransaction();

        try {

            /*
        |--------------------------------------------------------------------------
        | DELETE TRANSLATIONS
        |--------------------------------------------------------------------------
        */

            DanduongNgonngu::query()

                ->where(
                    'danduong_id',
                    $id
                )

                ->delete();

            /*
        |--------------------------------------------------------------------------
        | DELETE URLS
        |--------------------------------------------------------------------------
        */

            Url::query()

                ->where(
                    'entity_type',
                    'danduong'
                )

                ->where(
                    'entity_id',
                    $id
                )

                ->delete();

            /*
        |--------------------------------------------------------------------------
        | DELETE MENU
        |--------------------------------------------------------------------------
        */

            Danduong::query()

                ->where('id', $id)

                ->delete();

            DB::commit();
        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;
        }
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

                if (!empty($children)) {

                    $item->children = $children;
                }

                $branch[] = $item;
            }
        }

        return $branch;
    }
}
