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

        return response()->json(
            $this->menuService->getAdminMenus($lang)
        );
    }


    public function productCategories(Request $request)
    {
        $lang = $request->lang ?? 'vi';

        return response()->json(
            $this->menuService->getProductCategories($lang)
        );
    }
}
