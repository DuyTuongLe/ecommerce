<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Attribute;
use App\Models\Danduong;
use App\Models\Url;
use App\Services\MenuService;

class StoreProductController extends Controller
{
    protected $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    public function index(Request $request)
    {
        $lang = $request->get('lang', 'vi');
        $categoryId = $request->get('category_id');
        $brandId = $request->get('brand_id');
        $search = $request->get('search');
        $sort = $request->get('sort', 'newest');
        $limit = (int) $request->get('limit', 12);
        if (!in_array($limit, [12, 24, 48, 96])) $limit = 12;

        $query = Product::query()
            ->leftJoin('product_ngonngu', function ($join) use ($lang) {
                $join->on('products.id', '=', 'product_ngonngu.product_id')
                    ->where('product_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'products.thumbnail_id', '=', 'media.id')
            ->leftJoin('url', function ($join) use ($lang) {
                $join->on('products.id', '=', 'url.entity_id')
                    ->where('url.entity_type', 'product')
                    ->where('url.ngonngu', $lang);
            })
            ->where('products.status', 1);

        if ($categoryId) {
            $categoryIds = $this->menuService->getDescendantIds($categoryId);
            $query->join('product_danduong', 'products.id', '=', 'product_danduong.product_id')
                ->whereIn('product_danduong.danduong_id', $categoryIds)
                ->distinct();
        }

        if ($brandId) {
            $query->where('products.brand_id', $brandId);
        }

        if ($search) {
            $query->where('product_ngonngu.ten', 'like', '%' . $search . '%');
        }

        // Filter by attribute values: attrs[1]=1,3&attrs[2]=8
        $attrs = $request->get('attrs', []);
        if (is_array($attrs)) {
            foreach ($attrs as $attrId => $valueIds) {
                $ids = is_array($valueIds) ? $valueIds : explode(',', $valueIds);
                $ids = array_filter(array_map('intval', $ids));
                if (!empty($ids)) {
                    $query->whereIn('products.id', function ($sub) use ($ids) {
                        $sub->select('product_id')
                            ->from('product_attribute_values')
                            ->whereIn('attribute_value_id', $ids);
                    });
                }
            }
        }

        $query->select([
            'products.id',
            'products.sku',
            'products.price',
            'products.sale_price',
            'products.discount_type',
            'products.discount_percent',
            'products.discount_amount',
            'products.is_new',
            'products.featured',
            'product_ngonngu.ten as name',
            'media.path as thumbnail',
            'url.slug',
        ]);

        match ($sort) {
            'oldest' => $query->orderBy('products.id', 'asc'),
            'az' => $query->orderBy('product_ngonngu.ten', 'asc'),
            'za' => $query->orderBy('product_ngonngu.ten', 'desc'),
            'price_asc' => $query->orderBy('products.price', 'asc'),
            'price_desc' => $query->orderBy('products.price', 'desc'),
            default => $query->orderBy('products.id', 'desc'),
        };

        $products = $query->paginate($limit);

        $products->getCollection()->transform(function ($item) {
            $item->thumbnail = $item->thumbnail
                ? asset('storage/' . $item->thumbnail)
                : null;
            return $item;
        });

        return response()->json($products);
    }

    public function show(Request $request, $id)
    {
        $lang = $request->get('lang', 'vi');

        $product = Product::with(['thumbnail', 'gallery', 'brand', 'attributeValues.attribute', 'attributeValues.attributeValue', 'urls', 'categories'])
            ->where('status', 1)
            ->find($id);

        if (!$product) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $trans = $product->translations()->where('ngonngu', $lang)->first();
        $brandTrans = null;
        if ($product->brand) {
            $brandTrans = \DB::table('brand_ngonngu')
                ->where('brand_id', $product->brand_id)
                ->where('ngonngu', $lang)
                ->first();
        }

        // Attributes with translations
        $attrs = [];
        foreach ($product->attributeValues as $pav) {
            $attrTrans = \DB::table('attribute_ngonngu')
                ->where('attribute_id', $pav->attribute_id)
                ->where('ngonngu', $lang)
                ->first();
            $valTrans = \DB::table('attribute_value_ngonngu')
                ->where('attribute_value_id', $pav->attribute_value_id)
                ->where('ngonngu', $lang)
                ->first();
            $attrs[] = [
                'attribute_name' => $attrTrans->ten ?? $pav->attribute->code,
                'value_name' => $valTrans->ten ?? $pav->attributeValue->code,
                'color_code' => $pav->attributeValue->color_code,
            ];
        }

        // Alternate slugs
        $slugs = [];
        foreach ($product->urls as $u) {
            $slugs[$u->ngonngu] = $u->slug;
        }

        // Breadcrumbs from first category
        $breadcrumbs = [];
        $firstCat = $product->categories->first();
        if ($firstCat) {
            $crumbs = [];
            $current = $firstCat;
            while ($current) {
                $catTrans = \DB::table('danduong_ngonngu')
                    ->where('danduong_id', $current->id)
                    ->where('ngonngu', $lang)
                    ->first();
                $catUrl = Url::where('entity_type', 'danduong')
                    ->where('entity_id', $current->id)
                    ->where('ngonngu', $lang)
                    ->first();
                $crumbs[] = [
                    'title' => $catTrans->danduong_nn_ten ?? '',
                    'slug' => $catUrl->slug ?? null,
                    'category_id' => $current->id,
                ];
                $current = $current->goc_id ? Danduong::find($current->goc_id) : null;
            }
            $breadcrumbs = array_reverse($crumbs);
        }
        $breadcrumbs[] = ['title' => $trans->ten ?? '', 'slug' => null];

        // Related products (same categories)
        $categoryIds = $product->categories->pluck('id')->toArray();
        $related = [];
        if (!empty($categoryIds)) {
            $related = Product::query()
                ->join('product_danduong', 'products.id', '=', 'product_danduong.product_id')
                ->leftJoin('product_ngonngu', function ($join) use ($lang) {
                    $join->on('products.id', '=', 'product_ngonngu.product_id')
                        ->where('product_ngonngu.ngonngu', $lang);
                })
                ->leftJoin('media', 'products.thumbnail_id', '=', 'media.id')
                ->leftJoin('url', function ($join) use ($lang) {
                    $join->on('products.id', '=', 'url.entity_id')
                        ->where('url.entity_type', 'product')
                        ->where('url.ngonngu', $lang);
                })
                ->whereIn('product_danduong.danduong_id', $categoryIds)
                ->where('products.id', '!=', $product->id)
                ->where('products.status', 1)
                ->select([
                    'products.id', 'products.price', 'products.sale_price',
                    'products.discount_type', 'products.discount_percent', 'products.discount_amount',
                    'product_ngonngu.ten as name', 'media.path as thumbnail', 'url.slug',
                ])
                ->distinct()
                ->limit(6)
                ->get();

            $related->transform(function ($item) {
                $item->thumbnail = $item->thumbnail ? asset('storage/' . $item->thumbnail) : null;
                return $item;
            });
        }

        return response()->json([
            'id' => $product->id,
            'name' => $trans->ten ?? '',
            'short_description' => $trans->mota_ngan ?? '',
            'content' => $trans->noidung ?? '',
            'seo_title' => $trans->seo_title ?? '',
            'seo_description' => $trans->seo_description ?? '',
            'sku' => $product->sku,
            'price' => $product->price,
            'sale_price' => $product->sale_price,
            'discount_type' => $product->discount_type,
            'discount_percent' => $product->discount_percent,
            'discount_amount' => $product->discount_amount,
            'stock' => $product->stock,
            'stock_status' => $product->stock_status,
            'is_new' => $product->is_new,
            'featured' => $product->featured,
            'thumbnail' => $product->thumbnail ? asset('storage/' . $product->thumbnail->path) : null,
            'gallery' => $product->gallery->map(fn($m) => asset('storage/' . $m->path))->values(),
            'brand' => $brandTrans->ten ?? $product->brand?->name ?? null,
            'attributes' => $attrs,
            'alternate_slugs' => $slugs,
            'breadcrumbs' => $breadcrumbs,
            'related' => $related,
        ]);
    }

    public function categories(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        $items = Danduong::query()
            ->leftJoin('danduong_ngonngu', function ($join) use ($lang) {
                $join->on('danduong.id', '=', 'danduong_ngonngu.danduong_id')
                    ->where('danduong_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('url', function ($join) use ($lang) {
                $join->on('danduong.id', '=', 'url.entity_id')
                    ->where('url.entity_type', 'danduong')
                    ->where('url.ngonngu', $lang);
            })
            ->whereIn('danduong.type', ['product_category', 'menu_group'])
            ->where('danduong.trangthai', 1)
            ->select([
                'danduong.id',
                'danduong.goc_id',
                'danduong_ngonngu.danduong_nn_ten as name',
                'url.slug',
            ])
            ->orderBy('danduong.goc_id')
            ->orderBy('danduong.thutu')
            ->get();

        return response()->json($this->buildTree($items));
    }

    public function brands(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        $brands = Brand::query()
            ->leftJoin('brand_ngonngu', function ($join) use ($lang) {
                $join->on('brands.id', '=', 'brand_ngonngu.brand_id')
                    ->where('brand_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'brands.logo_id', '=', 'media.id')
            ->where('brands.status', 1)
            ->select([
                'brands.id',
                'brand_ngonngu.ten as name',
                'media.path as logo',
            ])
            ->orderBy('brands.id')
            ->get();

        $brands->transform(function ($item) {
            $item->logo = $item->logo ? asset('storage/' . $item->logo) : null;
            return $item;
        });

        return response()->json($brands);
    }

    public function attributes(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        $attributes = Attribute::query()
            ->leftJoin('attribute_ngonngu', function ($join) use ($lang) {
                $join->on('attributes.id', '=', 'attribute_ngonngu.attribute_id')
                    ->where('attribute_ngonngu.ngonngu', $lang);
            })
            ->where('attributes.status', 1)
            ->select([
                'attributes.id',
                'attributes.code',
                'attribute_ngonngu.ten as name',
            ])
            ->orderBy('attributes.id')
            ->get();

        $result = [];
        foreach ($attributes as $attr) {
            $values = \DB::table('attribute_values')
                ->leftJoin('attribute_value_ngonngu', function ($join) use ($lang) {
                    $join->on('attribute_values.id', '=', 'attribute_value_ngonngu.attribute_value_id')
                        ->where('attribute_value_ngonngu.ngonngu', $lang);
                })
                ->where('attribute_values.attribute_id', $attr->id)
                ->where('attribute_values.status', 1)
                ->select([
                    'attribute_values.id',
                    'attribute_values.code',
                    'attribute_values.color_code',
                    'attribute_value_ngonngu.ten as name',
                ])
                ->orderBy('attribute_values.thutu')
                ->get();

            $result[] = [
                'id' => $attr->id,
                'code' => $attr->code,
                'name' => $attr->name,
                'values' => $values,
            ];
        }

        return response()->json($result);
    }

    private function buildTree($items, $parentId = null)
    {
        $branch = [];
        foreach ($items as $item) {
            if ($item->goc_id == $parentId) {
                $children = $this->buildTree($items, $item->id);
                $node = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                ];
                if (!empty($children)) {
                    $node['children'] = $children;
                }
                $branch[] = $node;
            }
        }
        return $branch;
    }
}
