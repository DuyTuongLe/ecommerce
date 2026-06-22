<?php

// app/Http/Controllers/Api/Admin/ProductController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\MenuService;
use App\Http\Resources\ProductEditResource;
use App\Models\Attribute;
use App\Models\ProductNgonngu;
use App\Models\ProductAttributeValue;
use App\Models\Url;
use App\Services\SlugService;
use Illuminate\Support\Facades\DB;

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

        $status = $request->get(
            'status'
        );

        $search = $request->get(
    'search'
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

        if ($request->filled('status')) {

            $query->where(
                'products.status',
                $status
            );
        }

        if (!empty($search)) {

    $query->where(

        'product_ngonngu.ten',

        'like',

        '%' . $search . '%'

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

            'attributeValues.attribute',

            'urls'

        ])->findOrFail($id);

        return new ProductEditResource(
            $product
        );
    }

    public function store(
        Request $request
    ) {
        $product = DB::transaction(
            function () use ($request) {

                $product = Product::create([]);

                $this->saveProductData(
                    $product,
                    $request->all()
                );

                return $product;
            }
        );

        return response()->json([

            'id' => $product->id,

            'message' => 'Product created'

        ]);
    }

    public function bulkDelete(
        Request $request
    ) {
        $ids = $request->ids ?? [];

        DB::transaction(function () use (
            $ids
        ) {

            ProductAttributeValue::whereIn(
                'product_id',
                $ids
            )->delete();

            ProductNgonngu::whereIn(
                'product_id',
                $ids
            )->delete();

            DB::table(
                'product_danduong'
            )->whereIn(
                'product_id',
                $ids
            )->delete();

            DB::table(
                'product_media'
            )->whereIn(
                'product_id',
                $ids
            )->delete();

            DB::table('url')
                ->where(
                    'entity_type',
                    'product'
                )

                ->whereIn(
                    'entity_id',
                    $ids
                )

                ->delete();

            Product::whereIn(
                'id',
                $ids
            )->delete();
        });

        return response()->json([

            'message' =>
            'Products deleted'

        ]);
    }

    public function bulkStatus(
        Request $request
    ) {
        Product::whereIn(

            'id',

            $request->ids ?? []

        )->update([

            'status' =>
            $request->status

        ]);

        return response()->json([

            'message' =>
            'Status updated'

        ]);
    }

    public function update(
        Request $request,
        Product $product
    ) {
        DB::transaction(function () use (
            $product,
            $request
        ) {

            $this->saveProductData(
                $product,
                $request->all()
            );
        });

        return response()->json([

            'message' => 'Product updated'

        ]);
    }

    private function saveProductData(
        Product $product,
        array $data
    ) {
        // Product

        $product->update([

            'sku' => $data['sku'] ?? null,

            'barcode' => $data['barcode'] ?? null,

            'product_type' => $data['product_type'] ?? 'simple',

            'brand_id' => $data['brand_id'] ?? null,

            'thumbnail_id' => $data['thumbnail_id'] ?? null,

            'published_at' => $data['published_at'] ?? null,

            'status' => $data['status'] ?? 0,

            'featured' => $data['featured'] ?? 0,

            'is_new' => $data['is_new'] ?? 0,

            'price' => $data['price'] ?? null,

            'sale_price' => $data['sale_price'] ?? null,

            'cost_price' => $data['cost_price'] ?? null,

            'stock' => $data['stock'] ?? 0,

            'manage_stock' => $data['manage_stock'] ?? 0,

            'stock_status' => $data['stock_status'] ?? null

        ]);

        // Categories

        $product
            ->categories()
            ->sync(
                $data['category_ids'] ?? []
            );

        // Gallery

        $product
            ->gallery()
            ->sync(
                $data['gallery_ids'] ?? []
            );

        // Translations

        foreach (

            $data['translations'] ?? []

            as $lang => $translation

        ) {

            ProductNgonngu::updateOrCreate(

                [

                    'product_id' => $product->id,

                    'ngonngu' => $lang

                ],

                [

                    'ten' =>
                    $translation['name'] ?? null,

                    'mota_ngan' =>
                    $translation['short_description'] ?? null,

                    'noidung' =>
                    $translation['content'] ?? null,

                    'seo_title' =>
                    $translation['seo_title'] ?? null,

                    'seo_description' =>
                    $translation['seo_description'] ?? null,

                    'seo_keywords' =>
                    $translation['seo_keywords'] ?? null

                ]

            );

            if (!empty($translation['name'])) {

                $slugText =

                    trim(
                        $data['slugs'][$lang]
                            ?? ''
                    );

                if (empty($slugText)) {

                    $slugText =
                        $translation['name'];
                }

                $slug = SlugService::generate([

                    'text' =>
                    $slugText,

                    'entity_type' =>
                    'product',

                    'entity_id' =>
                    $product->id,

                    'ngonngu' =>
                    $lang

                ]);

                Url::updateOrCreate(

                    [

                        'entity_type' =>
                        'product',

                        'entity_id' =>
                        $product->id,

                        'ngonngu' =>
                        $lang

                    ],

                    [

                        'slug' =>
                        $slug

                    ]

                );
            }
        }

        // Attributes

        ProductAttributeValue::where(
            'product_id',
            $product->id
        )->delete();

        foreach (

            $data['attributes'] ?? []

            as $code => $valueId

        ) {

            $attribute = Attribute::where(
                'code',
                $code
            )->first();

            if (!$attribute) {
                continue;
            }

            ProductAttributeValue::create([

                'product_id' =>
                $product->id,

                'attribute_id' =>
                $attribute->id,

                'attribute_value_id' =>
                $valueId

            ]);
        }
    }
}
