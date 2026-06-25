<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request, $productId)
    {
        $reviews = ProductReview::where('product_id', $productId)
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|max:2000',
        ]);

        $review = ProductReview::create([
            'product_id' => $productId,
            'user_id' => null,
            'rating' => $request->rating,
            'title' => $request->title,
            'content' => $request->content,
            'status' => 0,
        ]);

        return response()->json(['success' => true, 'message' => 'Đánh giá đã gửi, đang chờ duyệt']);
    }

    public function summary($productId)
    {
        $reviews = ProductReview::where('product_id', $productId)->where('status', 1);

        $avg = round($reviews->avg('rating'), 1) ?: 0;
        $total = $reviews->count();

        $breakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $breakdown[$i] = ProductReview::where('product_id', $productId)
                ->where('status', 1)
                ->where('rating', $i)
                ->count();
        }

        return response()->json([
            'average' => $avg,
            'total' => $total,
            'breakdown' => $breakdown,
        ]);
    }
}
