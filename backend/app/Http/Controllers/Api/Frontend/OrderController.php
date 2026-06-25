<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;

use App\Models\OrderHistory;
use App\Models\Product;
use App\Models\Promotion;
use App\Mail\OrderConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function lookup(Request $request)
    {
        $request->validate([
            'order_code' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $query = Order::with(['items', 'histories' => function ($q) {
            $q->orderBy('created_at', 'desc');
        }]);

        if ($request->order_code) {
            $query->where('order_code', $request->order_code);
        }

        if ($request->phone) {
            $query->where('customer_phone', $request->phone);
        }

        if (!$request->order_code && !$request->phone) {
            return response()->json(['message' => 'Nhập mã đơn hàng hoặc số điện thoại'], 422);
        }

        $orders = $query->orderBy('created_at', 'desc')->limit(10)->get();

        if ($orders->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json($orders);
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $promo = Promotion::where('code', strtoupper($request->code))->first();

        if (!$promo) {
            return response()->json(['message' => 'Mã giảm giá không tồn tại'], 422);
        }

        if (!$promo->isValid()) {
            return response()->json(['message' => 'Mã giảm giá đã hết hạn hoặc đã hết lượt sử dụng'], 422);
        }

        if ($promo->minimum_order_value && $request->subtotal < $promo->minimum_order_value) {
            $min = number_format($promo->minimum_order_value, 0, ',', '.');
            return response()->json([
                'message' => "Đơn hàng tối thiểu {$min}đ để sử dụng mã này",
            ], 422);
        }

        $discount = $promo->calculateDiscount($request->subtotal);

        return response()->json([
            'success' => true,
            'code' => $promo->code,
            'type' => $promo->type,
            'value' => $promo->value,
            'discount' => $discount,
            'description' => $promo->type === 'percent'
                ? "Giảm {$promo->value}%"
                : "Giảm " . number_format($promo->value, 0, ',', '.') . "đ",
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'customer_email' => 'nullable|email',
            'shipping_address' => 'required|string',
            'shipping_city' => 'nullable|string',
            'shipping_district' => 'nullable|string',
            'shipping_ward' => 'nullable|string',
            'note' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'coupon_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $items = $request->input('items');
            $subtotal = 0;
            $orderItems = [];

            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product || !$product->status) continue;

                $lang = $request->get('lang', 'vi');
                $trans = $product->translations()->where('ngonngu', $lang)->first();
                $price = $product->sale_price ?: $product->price;
                $total = $price * $item['qty'];
                $subtotal += $total;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $trans?->ten ?? 'Product #' . $product->id,
                    'product_sku' => $product->sku,
                    'price' => $price,
                    'qty' => $item['qty'],
                    'total' => $total,
                ];
            }

            if (empty($orderItems)) {
                return response()->json(['message' => 'Không có sản phẩm hợp lệ'], 422);
            }

            $discountTotal = 0;
            $promo = null;

            if ($request->coupon_code) {
                $promo = Promotion::where('code', strtoupper($request->coupon_code))->first();
                if ($promo && $promo->isValid()) {
                    $discountTotal = $promo->calculateDiscount($subtotal);
                }
            }

            $grandTotal = max(0, $subtotal - $discountTotal);
            $orderCode = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

            $order = Order::create([
                'order_code' => $orderCode,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_district' => $request->shipping_district,
                'shipping_ward' => $request->shipping_ward,
                'note' => $request->note,
                'payment_method' => $request->payment_method ?? 'cod',
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'grand_total' => $grandTotal,
                'payment_status' => 'pending',
                'order_status' => 'pending',
            ]);

            foreach ($orderItems as $oi) {
                $order->items()->create($oi);
            }

            if ($promo && $discountTotal > 0) {
                $promo->increment('used_count');
            }

            OrderHistory::create([
                'order_id' => $order->id,
                'new_status' => 'pending',
                'note' => 'Đơn hàng mới' . ($promo ? " (mã giảm giá: {$promo->code})" : ''),
                'created_at' => now(),
            ]);

            DB::commit();

            try {
                if ($order->customer_email) {
                    Mail::to($order->customer_email)->send(new OrderConfirmation($order));
                }
                $adminEmail = DB::table('cauhinh')->where('key_name', 'admin_email')->value('value');
                if ($adminEmail) {
                    Mail::to($adminEmail)->send(new OrderConfirmation($order));
                }
            } catch (\Exception $e) {
                // Don't fail the order if email fails
            }

            return response()->json([
                'success' => true,
                'order_code' => $orderCode,
                'order_id' => $order->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi tạo đơn hàng'], 500);
        }
    }
}
