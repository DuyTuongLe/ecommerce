<?php
// app/Http/Controllers/Api/Admin/ProductController.php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    //
    public function index(Request $request)
    {
        $lang = $request->get('lang', "vi");

        $products = Product::query()
            ->leftJoin(
                'product_ngonngu',
                function ($join) use ($lang) {
                    $join->on(
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
            )
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

        return response()->json($products);
    }
}
