<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Danduong;
use App\Models\DanduongNgonngu;
use App\Models\Url;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class MenuController extends Controller
{
    //
    public function index(Request $request) {
        $ngonngu = $request->get('lang', 'vi');
        $group = $request->get('group');

        $query = Danduong::with(['ngonngu', 'url'])
            ->orderBy('thutu');

        // 🔥 FILTER THEO GROUP
        if ($group) {
            $query->where('danduong_nhom_id', $group);
        }

        $menus = $query->get();

        return response()->json(
            $menus->map(function ($item) use ($ngonngu) {

                $langItem = $item->ngonngu
                    ->where('ngonngu', $ngonngu)
                    ->first();

                return [
                    'id' => $item->id,
                    'goc_id' => $item->goc_id,
                    'thutu' => $item->thutu,
                    'trangthai' => $item->trangthai,
                    'type' => $item->type,
                    'ten' => $langItem->danduong_nn_ten ?? '',
                    'slug' => optional($item->url->first())->slug,
                ];
            })
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'lang' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {

            $parentId = $request->goc_id ?? null;

            // ===== 1. XỬ LÝ THỨ TỰ =====
            if ($request->thutu !== null) {

                // chèn vào giữa → đẩy các item phía sau
                Danduong::where('goc_id', $parentId)
                    ->where('thutu', '>=', $request->thutu)
                    ->increment('thutu');

                $thutu = $request->thutu;

            } else {

                // auto thêm cuối
                $max = Danduong::where('goc_id', $parentId)->max('thutu');
                $thutu = ($max ?? 0) + 1;
            }

            // ===== 2. TẠO MENU =====
            $menu = Danduong::create([
                'goc_id' => $parentId,
                'thutu' => $thutu,
                'trangthai' => $request->trangthai ?? 1,
                'type' => $request->type ?? 'page',
            ]);

            // ===== 3. NGÔN NGỮ =====
            DanduongNgonngu::create([
                'danduong_id' => $menu->id,
                'ngonngu' => $request->lang,
                'danduong_nn_ten' => $request->ten,
            ]);

            // ===== 4. SLUG (KHÔNG TRÙNG) =====
            $baseSlug = Str::slug($request->ten);
            $slug = $baseSlug;
            $i = 1;

            while (Url::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $i++;
            }

            Url::create([
                'danduong_id' => $menu->id,
                'slug' => $slug
            ]);

            return response()->json([
                'message' => 'Created',
                'id' => $menu->id
            ]);
        });
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'ten' => 'nullable|string|max:255',
            'lang' => 'required|string',
        ]);

        return DB::transaction(function () use ($request, $id) {

            $menu = Danduong::findOrFail($id);

            $oldParent = $menu->goc_id;
            $oldOrder  = $menu->thutu;

            $newParent = $request->goc_id ?? $oldParent;
            $newOrder  = $request->thutu;

            // ===== 1. XỬ LÝ DI CHUYỂN =====
            if ($newParent != $oldParent) {

                // 1.1 kéo lên: giảm thutu ở parent cũ
                Danduong::where('goc_id', $oldParent)
                    ->where('thutu', '>', $oldOrder)
                    ->decrement('thutu');

                // 1.2 xác định vị trí mới
                if ($newOrder !== null) {
                    Danduong::where('goc_id', $newParent)
                        ->where('thutu', '>=', $newOrder)
                        ->increment('thutu');

                    $menu->thutu = $newOrder;
                } else {
                    $max = Danduong::where('goc_id', $newParent)->max('thutu');
                    $menu->thutu = ($max ?? 0) + 1;
                }

                $menu->goc_id = $newParent;

            } else {

                // ===== 2. CÙNG PARENT → CHỈ ĐỔI VỊ TRÍ =====
                if ($newOrder !== null && $newOrder != $oldOrder) {

                    if ($newOrder > $oldOrder) {
                        // kéo xuống
                        Danduong::where('goc_id', $oldParent)
                            ->whereBetween('thutu', [$oldOrder + 1, $newOrder])
                            ->decrement('thutu');

                    } else {
                        // kéo lên
                        Danduong::where('goc_id', $oldParent)
                            ->whereBetween('thutu', [$newOrder, $oldOrder - 1])
                            ->increment('thutu');
                    }

                    $menu->thutu = $newOrder;
                }
            }

            // ===== 3. UPDATE FIELD KHÁC =====
            $menu->trangthai = $request->trangthai ?? $menu->trangthai;
            $menu->type      = $request->type ?? $menu->type;

            $menu->save();

            // ===== 4. UPDATE NGÔN NGỮ =====
            if ($request->ten) {
                DanduongNgonngu::updateOrCreate(
                    [
                        'danduong_id' => $menu->id,
                        'ngonngu' => $request->lang
                    ],
                    [
                        'danduong_nn_ten' => $request->ten
                    ]
                );

                // ===== 5. UPDATE SLUG =====
                $baseSlug = Str::slug($request->ten);
                $slug = $baseSlug;
                $i = 1;

                while (
                    Url::where('slug', $slug)
                        ->where('danduong_id', '!=', $menu->id)
                        ->exists()
                ) {
                    $slug = $baseSlug . '-' . $i++;
                }

                Url::updateOrCreate(
                    ['danduong_id' => $menu->id],
                    ['slug' => $slug]
                );
            }

            return response()->json([
                'message' => 'Updated'
            ]);
        });
    }

    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {

            $menu = Danduong::findOrFail($id);

            $hasChildren = Danduong::where('goc_id', $menu->id)->exists();

            if ($hasChildren) {
                return response()->json([
                    'message' => 'Không thể xóa vì còn menu con'
                ], 400);
            }

            $parentId = $menu->goc_id;
            $order    = $menu->thutu;

            DanduongNgonngu::where('danduong_id', $menu->id)->delete();

            Url::where('danduong_id', $menu->id)->delete();

            $menu->delete();

            Danduong::where('goc_id', $parentId)
                ->where('thutu', '>', $order)
                ->decrement('thutu');

            return response()->json([
                'message' => 'Deleted'
            ]);
        });
    }


    public function reorder(Request $request)
    {
        $items = $request->input('items');

        if (!is_array($items)) {
            return response()->json([
                'message' => 'Invalid data'
            ], 400);
        }

        return DB::transaction(function () use ($items) {

            foreach ($items as $item) {

                // validate cơ bản
                if (!isset($item['id'])) continue;

                Danduong::where('id', $item['id'])->update([
                    'goc_id' => $item['goc_id'] ?? null,
                    'thutu'  => $item['thutu'] ?? 0,
                ]);
            }

            return response()->json([
                'message' => 'Reordered'
            ]);
        });
    }
}
