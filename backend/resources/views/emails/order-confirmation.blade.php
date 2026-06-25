<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .wrap { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #2f456f; color: #fff; padding: 20px 24px; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 24px; }
        .info-row { display: flex; margin-bottom: 6px; }
        .info-label { color: #666; min-width: 120px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f5f5f5; text-align: left; padding: 8px 10px; font-size: 13px; border-bottom: 2px solid #ddd; }
        td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
        .total-row td { font-weight: 700; border-top: 2px solid #ddd; font-size: 15px; }
        .footer { padding: 16px 24px; background: #f9f9f9; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="header">
        <h1>Xác nhận đơn hàng</h1>
    </div>

    <div class="body">
        <p>Xin chào <strong>{{ $order->customer_name }}</strong>,</p>
        <p>Đơn hàng của bạn đã được tiếp nhận thành công.</p>

        <div style="background: #f0f7ff; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
            <strong>Mã đơn hàng: {{ $order->order_code }}</strong><br>
            <span style="font-size: 13px; color: #666;">Ngày đặt: {{ $order->created_at->format('d/m/Y H:i') }}</span>
        </div>

        <h3 style="font-size: 15px; margin: 20px 0 8px;">Thông tin giao hàng</h3>
        <div class="info-row"><span class="info-label">Họ tên:</span> {{ $order->customer_name }}</div>
        <div class="info-row"><span class="info-label">Điện thoại:</span> {{ $order->customer_phone }}</div>
        @if($order->customer_email)
        <div class="info-row"><span class="info-label">Email:</span> {{ $order->customer_email }}</div>
        @endif
        <div class="info-row"><span class="info-label">Địa chỉ:</span> {{ collect([$order->shipping_address, $order->shipping_ward, $order->shipping_district, $order->shipping_city])->filter()->implode(', ') }}</div>
        <div class="info-row"><span class="info-label">Thanh toán:</span> {{ strtoupper($order->payment_method) }}</div>
        @if($order->note)
        <div class="info-row"><span class="info-label">Ghi chú:</span> {{ $order->note }}</div>
        @endif

        <h3 style="font-size: 15px; margin: 20px 0 8px;">Chi tiết đơn hàng</h3>
        <table>
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th style="text-align:right">Giá</th>
                    <th style="text-align:center">SL</th>
                    <th style="text-align:right">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}
                        @if($item->product_sku)<br><span style="color:#999;font-size:11px">SKU: {{ $item->product_sku }}</span>@endif
                    </td>
                    <td style="text-align:right">{{ number_format($item->price, 0, ',', '.') }}đ</td>
                    <td style="text-align:center">{{ $item->qty }}</td>
                    <td style="text-align:right">{{ number_format($item->total, 0, ',', '.') }}đ</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div style="text-align: right; margin-top: 8px;">
            <div>Tạm tính: {{ number_format($order->subtotal, 0, ',', '.') }}đ</div>
            @if($order->discount_total > 0)
            <div style="color: green;">Giảm giá: -{{ number_format($order->discount_total, 0, ',', '.') }}đ</div>
            @endif
            <div style="font-size: 18px; font-weight: 700; color: #2f456f; margin-top: 4px;">
                Tổng cộng: {{ number_format($order->grand_total, 0, ',', '.') }}đ
            </div>
        </div>
    </div>

    <div class="footer">
        Cảm ơn bạn đã mua hàng!
    </div>
</div>
</body>
</html>
