<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductReview::query()
            ->leftJoin('products', 'product_reviews.product_id', '=', 'products.id')
            ->leftJoin('product_ngonngu', function ($join) use ($request) {
                $join->on('products.id', '=', 'product_ngonngu.product_id')
                    ->where('product_ngonngu.ngonngu', $request->get('lang', 'vi'));
            })
            ->select([
                'product_reviews.*',
                'product_ngonngu.ten as product_name',
                'products.sku as product_sku',
            ]);

        if ($request->has('status')) {
            $query->where('product_reviews.status', $request->get('status'));
        }

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('product_reviews.content', 'like', "%{$search}%")
                  ->orWhere('product_reviews.title', 'like', "%{$search}%")
                  ->orWhere('product_ngonngu.ten', 'like', "%{$search}%");
            });
        }

        $reviews = $query->orderBy('product_reviews.created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($reviews);
    }

    public function approve($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['status' => 1]);
        return response()->json(['success' => true]);
    }

    public function reject($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->update(['status' => 0]);
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        ProductReview::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'action' => 'required|in:approve,reject,delete',
        ]);

        $reviews = ProductReview::whereIn('id', $request->ids);

        if ($request->action === 'approve') {
            $reviews->update(['status' => 1]);
        } elseif ($request->action === 'reject') {
            $reviews->update(['status' => 0]);
        } else {
            $reviews->delete();
        }

        return response()->json(['success' => true]);
    }
}
