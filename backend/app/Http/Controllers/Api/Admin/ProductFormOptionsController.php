<?php
// app/Http/Controllers/Api/Admin/ProductFormOptionsController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Brand;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Danduong;

class ProductFormOptionsController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->get(
            'lang',
            'vi'
        );

        return response()->json([

            'brands' =>
            $this->getBrands($lang),

            'categories' =>
            $this->getCategories($lang),

            'attributes' =>
            $this->getAttributes($lang)

        ]);
    }

    protected function getBrands($lang)
    {
        return Brand::query()

            ->leftJoin(
                'brand_ngonngu',
                function ($join) use ($lang) {

                    $join
                        ->on(
                            'brands.id',
                            '=',
                            'brand_ngonngu.brand_id'
                        )
                        ->where(
                            'brand_ngonngu.ngonngu',
                            $lang
                        );
                }
            )

            ->select([
                'brands.id as value',
                'brand_ngonngu.ten as label'
            ])

            ->orderBy('label')

            ->get();
    }

    protected function getCategories($lang)
    {
        $rows = Danduong::query()

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

            ->orderBy('danduong.thutu')

            ->get();

        return $this->buildTree(
            $rows,
            2
        );
    }

    protected function buildTree(
        $items,
        $parentId = 2
    ) {
        return $items

            ->where(
                'goc_id',
                $parentId
            )

            ->map(function ($item) use ($items) {

                $children = $this->buildTree(
                    $items,
                    $item->id
                );

                return [

                    'title' => $item->name,

                    'value' => $item->id,

                    'key' => $item->id,

                    'type' => $item->type,

                    'disableCheckbox' =>

                    $item->type === 'menu_group'

                        ||

                        $children->isNotEmpty(),

                    'children' => $children

                ];
            })

            ->values();
    }

    protected function getAttributes($lang)
    {
        $attributes = Attribute::query()

            ->with([

                'translations' => function ($query) use ($lang) {

                    $query->where(
                        'ngonngu',
                        $lang
                    );
                },

                'values' => function ($query) {
                    $query->where('status', 1);
                },

                'values.translations' => function ($query) use ($lang) {

                    $query->where(
                        'ngonngu',
                        $lang
                    );
                }
            ])

            ->where('status', 1)

            ->get();

        return $attributes->map(

            function ($attribute) {

                return [

                    'id' =>
                    $attribute->id,

                    'code' =>
                    $attribute->code,

                    'name' =>
                    $attribute
                        ->translations
                        ->first()?->ten,

                    'options' =>

                    $attribute
                        ->values

                        ->map(function ($value) {

                            return [

                                'value' =>
                                $value->id,

                                'label' =>
                                $value
                                    ->translations
                                    ->first()?->ten,

                                'color_code' =>
                                $value->color_code

                            ];
                        })

                        ->values()

                ];
            }

        );
    }
}
