<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $todayOrders = Order::whereDate('created_at', $today);
        $monthOrders = Order::where('created_at', '>=', $startOfMonth);

        return response()->json([
            'today_orders' => $todayOrders->count(),
            'today_revenue' => $todayOrders->sum('grand_total'),
            'month_orders' => $monthOrders->count(),
            'month_revenue' => $monthOrders->sum('grand_total'),
            'pending_orders' => Order::where('order_status', 'pending')->count(),
            'total_products' => Product::where('status', 1)->count(),
        ]);
    }

    public function chart(Request $request)
    {
        $days = $request->get('days', 30);
        $from = Carbon::now()->subDays($days)->startOfDay();

        $rows = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(grand_total) as revenue')
            )
            ->where('created_at', '>=', $from)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        $result = [];
        $current = $from->copy();
        $end = Carbon::today();

        while ($current->lte($end)) {
            $dateStr = $current->format('Y-m-d');
            $row = $rows->firstWhere('date', $dateStr);
            $result[] = [
                'date' => $dateStr,
                'orders' => $row ? (int) $row->orders : 0,
                'revenue' => $row ? (float) $row->revenue : 0,
            ];
            $current->addDay();
        }

        return response()->json($result);
    }

    public function topProducts(Request $request)
    {
        $limit = $request->get('limit', 10);
        $lang = $request->get('lang', 'vi');

        $products = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('product_ngonngu', function ($join) use ($lang) {
                $join->on('products.id', '=', 'product_ngonngu.product_id')
                    ->where('product_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'products.thumbnail_id', '=', 'media.id')
            ->select([
                'products.id',
                'order_items.product_name as name',
                'products.sku',
                'media.path as thumbnail',
                DB::raw('SUM(order_items.qty) as total_qty'),
                DB::raw('SUM(order_items.total) as total_revenue'),
            ])
            ->groupBy('products.id', 'order_items.product_name', 'products.sku', 'media.path')
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->get();

        $products->transform(function ($item) {
            $item->thumbnail = $item->thumbnail ? asset('storage/' . $item->thumbnail) : null;
            return $item;
        });

        return response()->json($products);
    }
}
