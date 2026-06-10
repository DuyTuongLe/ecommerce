<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Brand;
use App\Models\BrandNgonngu;

class BrandController extends Controller
{
    //
    public function index(Request $request)
    {
        $lang = $request->get(
            'lang',
            'vi'
        );

        $brands = Brand::query()

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

            ->leftJoin(
                'media',
                'brands.logo_id',
                '=',
                'media.id'
            )

            ->select([

                'brands.id',

                'brands.status',

                'brands.logo_id',

                'brand_ngonngu.ten as name',

                'media.path as logo'

            ])

            ->orderBy('brands.id')

            ->get();

        $brands->transform(

            function ($item) {

                $item->logo =
                    $item->logo

                    ? asset(
                        'storage/' .
                            $item->logo
                    )

                    : null;

                return $item;
            }

        );

        return response()->json(
            $brands
        );
    }

    public function bulkSave(
        Request $request
    ) {

        $lang = $request->input(
            'lang',
            'vi'
        );

        $rows = $request->input(
            'rows',
            []
        );

        foreach ($rows as $row) {

            $brand = Brand::find(
                $row['id']
            );

            if (!$brand) {
                continue;
            }

            $updateData = [];

            if (
                array_key_exists(
                    'status',
                    $row
                )
            ) {

                $updateData['status']
                    = $row['status'];
            }

            if (
                array_key_exists(
                    'logo_id',
                    $row
                )
            ) {

                $updateData['logo_id']
                    = $row['logo_id'];
            }

            if (!empty($updateData)) {

                $brand->update(
                    $updateData
                );
            }

            if (
                array_key_exists(
                    'name',
                    $row
                )
            ) {

                BrandNgonngu::updateOrCreate(

                    [

                        'brand_id' =>
                        $brand->id,

                        'ngonngu' =>
                        $lang

                    ],

                    [

                        'ten' =>
                        $row['name']

                    ]

                );
            }
        }

        return response()->json([

            'success' => true

        ]);
    }
    public function store(
        Request $request
    ) {

        $lang = $request->get(
            'lang',
            'vi'
        );

        $brand = Brand::create([

            'status' => 0,

            'logo_id' => null

        ]);

        BrandNgonngu::create([

            'brand_id' =>
            $brand->id,

            'ngonngu' =>
            $lang,

            'ten' => ''

        ]);

        return response()->json([

            'success' => true,

            'id' =>
            $brand->id

        ]);
    }

    public function bulkDelete(
        Request $request
    ) {

        $ids = $request->ids ?? [];

        $failed = [];

        foreach ($ids as $id) {

            $productCount = Product::query()

                ->where(
                    'brand_id',
                    $id
                )

                ->count();

            if ($productCount > 0) {

                $brand = BrandNgonngu::query()

                    ->where(
                        'brand_id',
                        $id
                    )

                    ->where(
                        'ngonngu',
                        'vi'
                    )

                    ->first();

                $failed[] = [

                    'id' => $id,

                    'name' =>
                    $brand?->ten,

                    'product_count' =>
                    $productCount

                ];

                continue;
            }

            BrandNgonngu::query()

                ->where(
                    'brand_id',
                    $id
                )

                ->delete();

            Brand::query()

                ->where(
                    'id',
                    $id
                )

                ->delete();
        }

        return response()->json([

            'success' => true,

            'failed' => $failed

        ]);
    }
}
