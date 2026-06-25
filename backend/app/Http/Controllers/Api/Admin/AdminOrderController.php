<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderHistory;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('order_status')) {
            $query->where('order_status', $status);
        }

        if ($paymentStatus = $request->get('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['items', 'histories' => function ($q) {
            $q->orderBy('created_at', 'desc');
        }])->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'order_status' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);
        $changes = [];

        if ($request->has('order_status') && $request->order_status !== $order->order_status) {
            $oldStatus = $order->order_status;
            $order->order_status = $request->order_status;
            $changes[] = "Trạng thái: {$oldStatus} → {$request->order_status}";

            OrderHistory::create([
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $request->order_status,
                'note' => $request->note ?: "Cập nhật trạng thái đơn hàng",
                'created_by' => auth()->id(),
                'created_at' => now(),
            ]);
        }

        if ($request->has('payment_status') && $request->payment_status !== $order->payment_status) {
            $oldPayment = $order->payment_status;
            $order->payment_status = $request->payment_status;
            $changes[] = "Thanh toán: {$oldPayment} → {$request->payment_status}";

            OrderHistory::create([
                'order_id' => $order->id,
                'old_status' => $oldPayment,
                'new_status' => $request->payment_status,
                'note' => $request->note ?: "Cập nhật trạng thái thanh toán",
                'created_by' => auth()->id(),
                'created_at' => now(),
            ]);
        }

        $order->save();

        return response()->json([
            'success' => true,
            'order' => $order->load(['items', 'histories' => function ($q) {
                $q->orderBy('created_at', 'desc');
            }]),
        ]);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        if (!in_array($order->order_status, ['pending', 'cancelled'])) {
            return response()->json([
                'message' => 'Chỉ có thể xóa đơn hàng ở trạng thái chờ xử lý hoặc đã hủy',
            ], 422);
        }

        $order->items()->delete();
        $order->histories()->delete();
        $order->delete();

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);

        $orders = Order::whereIn('id', $request->ids)
            ->whereIn('order_status', ['pending', 'cancelled'])
            ->get();

        foreach ($orders as $order) {
            $order->items()->delete();
            $order->histories()->delete();
            $order->delete();
        }

        $skipped = count($request->ids) - $orders->count();

        return response()->json([
            'success' => true,
            'deleted' => $orders->count(),
            'skipped' => $skipped,
        ]);
    }
}
