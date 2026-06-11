<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Attribute;
use App\Models\AttributeNgonngu;
use App\Models\AttributeValue;

use App\Services\CodeService;

class AttributeController extends Controller
{
    public function index(
        Request $request
    ) {

        $lang = $request->get(
            "lang",
            "vi"
        );

        $attributes = Attribute::query()

            ->leftJoin(

                'attribute_ngonngu',

                function ($join) use ($lang) {

                    $join

                        ->on(
                            'attributes.id',
                            '=',
                            'attribute_ngonngu.attribute_id'
                        )

                        ->where(
                            'attribute_ngonngu.ngonngu',
                            $lang
                        );
                }

            )

            ->select([

                'attributes.id',

                'attributes.code',

                'attributes.type',

                'attributes.status',

                'attribute_ngonngu.ten as name'

            ])

            ->orderBy(
                'attributes.id'
            )

            ->get();

        return response()->json(
            $attributes
        );
    }

    public function store(
        Request $request
    ) {

        $lang = $request->get(
            'lang',
            'vi'
        );

        $attribute = Attribute::create([

            'code' => null,

            'type' => 'select',

            'status' => 0

        ]);

        AttributeNgonngu::create([

            'attribute_id' =>
                $attribute->id,

            'ngonngu' =>
                $lang,

            'ten' => ''

        ]);

        return response()->json([

            'success' => true,

            'id' =>
                $attribute->id

        ]);
    }

    public function bulkSave(
        Request $request
    ) {

        $lang = $request->get(
            'lang',
            'vi'
        );

        $rows =
            $request->rows ?? [];

        foreach (
            $rows
            as $row
        ) {

            $attribute = Attribute::find(
                $row['id']
            );

            if (!$attribute) {

                continue;
            }

            $updateData = [];

            $isNewAttribute =

                empty(
                    $attribute->code
                );

            if (

                $isNewAttribute

                &&

                !empty(
                    $row['name']
                )

            ) {

                $updateData['code']

                    = CodeService::generate(

                        $row['name'],

                        Attribute::class

                    );
            }

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
                    'type',
                    $row
                )

            ) {

                $updateData['type']

                    = $row['type'];
            }

            if (
                !empty(
                    $updateData
                )
            ) {

                $attribute->update(
                    $updateData
                );
            }

            AttributeNgonngu::updateOrCreate(

                [

                    'attribute_id' =>
                        $attribute->id,

                    'ngonngu' =>
                        $lang

                ],

                [

                    'ten' =>
                        $row['name']

                ]

            );
        }

        return response()->json([

            'success' => true

        ]);
    }

    public function bulkDelete(
        Request $request
    ) {

        $ids = $request->ids ?? [];

        $failed = [];

        foreach ($ids as $id) {

            $valueCount =

                AttributeValue::query()

                ->where(
                    'attribute_id',
                    $id
                )

                ->count();

            if (
                $valueCount > 0
            ) {

                $attributeName =

                    AttributeNgonngu::query()

                    ->where(
                        'attribute_id',
                        $id
                    )

                    ->where(
                        'ngonngu',
                        'vi'
                    )

                    ->value(
                        'ten'
                    );

                $failed[] = [

                    'id' => $id,

                    'name' =>
                        $attributeName,

                    'value_count' =>
                        $valueCount

                ];

                continue;
            }

            AttributeNgonngu::query()

                ->where(
                    'attribute_id',
                    $id
                )

                ->delete();

            Attribute::query()

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