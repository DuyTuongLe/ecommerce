<?php

// app/Http/Controllers/Api/Admin/AdminMenuController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\MenuService;

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
}
