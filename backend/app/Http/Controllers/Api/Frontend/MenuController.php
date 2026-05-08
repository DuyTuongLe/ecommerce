<?php

// app/Http/Controllers/Api/Frontend/MenuController.php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\MenuService;

class MenuController extends Controller
{
    //
    protected $menuService;

    public function __construct(
        MenuService $menuService
    ) {
        $this->menuService = $menuService;
    }


    public function header(Request $request)
    {
        $lang = $request->lang ?? 'vi';

        return response()->json(

            $this->menuService
                ->getHeaderMenu($lang)

        );
    }


    public function productMenu(Request $request)
    {
        $lang = $request->lang ?? 'vi';

        return response()->json(
            $this->menuService->getFrontendProductMenu($lang)
        );
    }
}
