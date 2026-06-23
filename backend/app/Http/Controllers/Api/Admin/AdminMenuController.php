<?php

// app/Http/Controllers/Api/Admin/AdminMenuController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\MenuService;
use App\Models\DanduongNhom;
use Illuminate\Validation\Rule;

class AdminMenuController extends Controller
{
    //

    protected $menuService;

    public function __construct(
        MenuService $menuService
    ) {
        $this->menuService = $menuService;
    }

    public function index(Request $request)
    {
        $lang = $request->lang ?? 'vi';
        $groupId = $request->group_id;

        return response()->json(
            $this->menuService->getAdminMenus($lang, $groupId)
        );
    }

    public function sort(Request $request)
    {
        $items = $request->all();

        $this->menuService->sortMenus($items);

        return response()->json(['sucess' => true]);
    }


    public function productCategories(Request $request)
    {
        $lang = $request->lang ?? 'vi';

        return response()->json(
            $this->menuService->getProductCategories($lang)
        );
    }

    public function groups()
    {
        return response()->json(
            $this->menuService->getMenuGroups()
        );
    }

    public function store(Request $request)
    {
        return response()->json(

            $this->menuService->saveMenu(
                $request->all()
            )

        );
    }

    public function destroy($id)
    {
        $this->menuService->deleteMenu($id);

        return response()->json([
            'success' => true
        ]);
    }

    // ── Menu Group CRUD ──

    public function storeGroup(Request $request)
    {
        $data = $request->validate([
            'danduong_nhom_ten' => ['required', 'string', 'max:100', 'unique:danduong_nhom,danduong_nhom_ten'],
            'danduong_nhom_tieude' => ['required', 'string', 'max:255'],
        ]);

        $group = DanduongNhom::create([
            'danduong_nhom_ten' => $data['danduong_nhom_ten'],
            'danduong_nhom_tieude' => $data['danduong_nhom_tieude'],
            'macdinh' => 0,
        ]);

        return response()->json([
            'success' => true,
            'group' => $group,
        ]);
    }

    public function updateGroup(Request $request, $id)
    {
        $group = DanduongNhom::findOrFail($id);

        $data = $request->validate([
            'danduong_nhom_ten' => [
                'required', 'string', 'max:100',
                Rule::unique('danduong_nhom', 'danduong_nhom_ten')->ignore($id),
            ],
            'danduong_nhom_tieude' => ['required', 'string', 'max:255'],
        ]);

        $group->update($data);

        return response()->json([
            'success' => true,
            'group' => $group->fresh(),
        ]);
    }

    public function destroyGroup($id)
    {
        $group = DanduongNhom::findOrFail($id);

        if ($group->macdinh) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa nhóm mặc định.',
            ], 422);
        }

        $menuCount = $group->menus()->count();
        if ($menuCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Nhóm đang chứa {$menuCount} menu. Hãy di chuyển hoặc xóa menu trước.",
            ], 422);
        }

        $group->delete();

        return response()->json(['success' => true]);
    }
}
