<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = Promotion::query();

        if ($search = $request->get('search')) {
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $promotions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        $promotions->getCollection()->transform(function ($promo) {
            $promo->product_ids = $promo->products()->pluck('products.id');
            $promo->danduong_ids = $promo->danduongs()->pluck('danduong.id');
            $promo->is_valid = $promo->isValid();
            return $promo;
        });

        return response()->json($promotions);
    }

    public function show($id)
    {
        $promo = Promotion::findOrFail($id);
        $promo->product_ids = $promo->products()->pluck('products.id');
        $promo->danduong_ids = $promo->danduongs()->pluck('danduong.id');
        return response()->json($promo);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:100|unique:promotions,code',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'usage_limit' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);

        $promo = Promotion::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'minimum_order_value' => $request->minimum_order_value ?? 0,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'usage_limit' => $request->usage_limit,
            'used_count' => 0,
            'status' => $request->status ?? true,
        ]);

        if ($request->has('product_ids')) {
            $promo->products()->sync($request->product_ids);
        }
        if ($request->has('danduong_ids')) {
            $promo->danduongs()->sync($request->danduong_ids);
        }

        return response()->json(['success' => true, 'id' => $promo->id]);
    }

    public function update(Request $request, $id)
    {
        $promo = Promotion::findOrFail($id);

        $request->validate([
            'code' => "required|string|max:100|unique:promotions,code,{$id}",
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'usage_limit' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);

        $promo->update([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'minimum_order_value' => $request->minimum_order_value ?? 0,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'usage_limit' => $request->usage_limit,
            'status' => $request->status ?? true,
        ]);

        if ($request->has('product_ids')) {
            $promo->products()->sync($request->product_ids);
        }
        if ($request->has('danduong_ids')) {
            $promo->danduongs()->sync($request->danduong_ids);
        }

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $promo = Promotion::findOrFail($id);
        $promo->products()->detach();
        $promo->danduongs()->detach();
        $promo->delete();

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);

        $promos = Promotion::whereIn('id', $request->ids)->get();
        foreach ($promos as $promo) {
            $promo->products()->detach();
            $promo->danduongs()->detach();
            $promo->delete();
        }

        return response()->json(['success' => true, 'deleted' => $promos->count()]);
    }
}
