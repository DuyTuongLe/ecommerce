<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AttributeNgonngu;
use App\Models\Attribute;
use App\Models\AttributeValueNgonngu;
use App\Models\AttributeValue;
use App\Models\ProductAttributeValue;

use App\Services\CodeService;

class AttributeValueController extends Controller
{
    //
    public function index(Request $request)
    {
        $lang = $request->get("lang", "vi");
        $attributevalues = AttributeValue::query()
            ->leftJoin(
                'attribute_value_ngonngu',
                function ($join) use ($lang) {
                    $join
                        ->on(
                            'attribute_values.id',
                            '=',
                            'attribute_value_ngonngu.attribute_value_id'
                        )

                        ->where(
                            'attribute_value_ngonngu.ngonngu',
                            $lang
                        );
                }
            )
            ->select([

                'attribute_values.id',

                'attribute_values.attribute_id',

                'attribute_values.code',

                'attribute_values.color_code',

                'attribute_values.thutu',

                'attribute_values.status',

                'attribute_value_ngonngu.ten as name'

            ])

            ->orderBy(
                'attribute_values.id'
            )

            ->get();

        return response()->json(
            $attributevalues
        );
    }

    public function store(
    Request $request
) {

    $lang = $request->get(
        'lang',
        'vi'
    );

    $firstAttribute =

        Attribute::query()

        ->orderBy('id')

        ->first();

    if (!$firstAttribute) {

        return response()->json([

            'success' => false,

            'message' =>
                'No attribute found'

        ], 422);

    }

    $attributevalue = AttributeValue::create([

        'attribute_id' =>
            $firstAttribute->id,

        'code' => null,

        'color_code' => null,

        'thutu' => 0,

        'status' => 0

    ]);

    AttributeValueNgonngu::create([

        'attribute_value_id' =>
            $attributevalue->id,

        'ngonngu' =>
            $lang,

        'ten' => ''

    ]);

    return response()->json([

        'success' => true,

        'id' =>
            $attributevalue->id

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

            $attributevalue = AttributeValue::find(
                $row['id']
            );

            if (!$attributevalue) {

                continue;
            }

            $updateData = [];

            if (

                array_key_exists(
                    'attribute_id',
                    $row
                )

            ) {

                $updateData['attribute_id']

                    =

                    $row['attribute_id'];
            }

            $isNewAttributeValue =

                empty($attributevalue->code);

            if (

                $isNewAttributeValue

                &&

                !empty($row['name'])

            ) {

                $updateData['code']

                    = CodeService::generate(

                        $row['name'],

                        AttributeValue::class

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
                    'color_code',
                    $row
                )

            ) {
                $updateData['color_code']
                    = $row['color_code'];
            }

            if (

                array_key_exists(
                    'thutu',
                    $row
                )

            ) {
                $updateData['thutu']
                    = $row['thutu'];
            }

            if (
                !empty($updateData)
            ) {

                $attributevalue->update(
                    $updateData
                );
            }

            AttributeValueNgonngu::updateOrCreate(

                [

                    'attribute_value_id' =>
                    $attributevalue->id,

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

            $productCount = ProductAttributeValue::query()

                ->where(
                    'attribute_value_id',
                    $id
                )

                ->count();

            if ($productCount > 0) {

                $valueName =
                    AttributeValueNgonngu::query()

                    ->where(
                        'attribute_value_id',
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
                    $valueName,

                    'product_count' =>
                    $productCount

                ];

                continue;
            }

            AttributeValueNgonngu::query()

                ->where(
                    'attribute_value_id',
                    $id
                )

                ->delete();

            AttributeValue::query()

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
