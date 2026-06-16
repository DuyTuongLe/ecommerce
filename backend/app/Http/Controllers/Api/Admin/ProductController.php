<?php

// app/Http/Controllers/Api/Admin/ProductController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\MenuService;
use App\Http\Resources\ProductEditResource;

class ProductController extends Controller
{
    protected $menuService;

    public function __construct(
        MenuService $menuService
    ) {
        $this->menuService = $menuService;
    }

    public function index(Request $request)
    {
        $lang = $request->get(
            'lang',
            'vi'
        );

        $categoryId = $request->get(
            'category_id'
        );

        $query = Product::query()

            ->leftJoin(
                'product_ngonngu',
                function ($join) use ($lang) {

                    $join
                        ->on(
                            'products.id',
                            '=',
                            'product_ngonngu.product_id'
                        )
                        ->where(
                            'product_ngonngu.ngonngu',
                            $lang
                        );
                }
            )

            ->leftJoin(
                'media',
                'products.thumbnail_id',
                '=',
                'media.id'
            );

        if ($categoryId) {

            $categoryIds =
                $this->menuService
                ->getDescendantIds(
                    $categoryId
                );

            $query

                ->join(
                    'product_danduong',
                    'products.id',
                    '=',
                    'product_danduong.product_id'
                )

                ->whereIn(
                    'product_danduong.danduong_id',
                    $categoryIds
                );
        }

        $products = $query

            ->select([

                'products.id',

                'products.sku',

                'products.price',

                'products.sale_price',

                'products.status',

                'product_ngonngu.ten as name',

                'media.path as thumbnail'

            ])

            ->latest('products.id')

            ->paginate(20);

        $products->getCollection()->transform(

            function ($item) {

                $item->thumbnail =
                    $item->thumbnail

                    ? asset(
                        'storage/' .
                            $item->thumbnail
                    )

                    : null;

                return $item;
            }

        );

        return response()->json(
            $products
        );
    }

    public function show($id)
    {
        $product = Product::with([

            'translations',

            'thumbnail',

            'gallery',

            'categories',

            'attributeValues.attribute'

        ])->findOrFail($id);

        return new ProductEditResource(
            $product
        );
    }
}
