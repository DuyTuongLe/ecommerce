<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\NgonNgu;

class LanguageController extends Controller
{
    public function index(Request $request)
    {
        $query = NgonNgu::query();

        // Mặc định chỉ trả ngôn ngữ đang bật (dùng cho selector ở các nơi khác).
        // Trang quản lý gọi ?all=1 để lấy cả ngôn ngữ đang tắt.
        if (!$request->boolean('all')) {
            $query->where('status', 1);
        }

        $languages = $query
            ->orderByDesc('macdinh')
            ->orderBy('id')
            ->get();

        return response()->json($languages);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);

        $language = DB::transaction(function () use ($data) {
            if (!empty($data['macdinh'])) {
                NgonNgu::where('macdinh', 1)->update(['macdinh' => 0]);
            }

            return NgonNgu::create($data);
        });

        return response()->json([
            'success' => true,
            'language' => $language,
        ]);
    }

    public function update(Request $request, $id)
    {
        $language = NgonNgu::findOrFail($id);
        $data = $this->validateData($request, $id);

        // Không cho bỏ mặc định của ngôn ngữ mặc định hiện tại;
        // muốn đổi thì đặt ngôn ngữ khác làm mặc định.
        if ($language->macdinh && empty($data['macdinh'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể bỏ mặc định. Hãy đặt ngôn ngữ khác làm mặc định.',
            ], 422);
        }

        DB::transaction(function () use ($language, $data) {
            if (!empty($data['macdinh'])) {
                NgonNgu::where('macdinh', 1)
                    ->where('id', '!=', $language->id)
                    ->update(['macdinh' => 0]);
            }

            $language->update($data);
        });

        return response()->json([
            'success' => true,
            'language' => $language->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $language = NgonNgu::findOrFail($id);

        if ($language->macdinh) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa ngôn ngữ mặc định.',
            ], 422);
        }

        $language->delete();

        return response()->json(['success' => true]);
    }

    protected function validateData(Request $request, $id = null)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('ngonngu', 'code')->ignore($id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'macdinh' => ['nullable', 'boolean'],
            'status' => ['nullable', 'boolean'],
        ]);

        return [
            'code' => $validated['code'],
            'name' => $validated['name'],
            'macdinh' => (int) ($validated['macdinh'] ?? 0),
            'status' => (int) ($validated['status'] ?? 1),
        ];
    }
}
