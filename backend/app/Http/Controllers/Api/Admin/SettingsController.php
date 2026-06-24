<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CauHinh;
use App\Models\Media;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = CauHinh::all()->pluck('value', 'key_name');

        if (isset($settings['css_variables']) && is_string($settings['css_variables'])) {
            $settings['css_variables'] = json_decode($settings['css_variables'], true);
        }

        foreach (['logo_id', 'favicon_id'] as $key) {
            if (!empty($settings[$key])) {
                $media = Media::find($settings[$key]);
                $settings[$key . '_url'] = $media ? asset('storage/' . $media->path) : null;
            }
        }

        return response()->json($settings);
    }

    public function saveCssVariables(Request $request)
    {
        $variables = $request->input('css_variables', []);

        CauHinh::updateOrCreate(
            ['key_name' => 'css_variables'],
            ['value' => json_encode($variables)]
        );

        return response()->json(['success' => true]);
    }

    public function update(Request $request)
    {
        $settings = $request->input('settings', []);

        foreach ($settings as $key => $value) {
            if ($key === 'css_variables') continue;
            CauHinh::updateOrCreate(
                ['key_name' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        return response()->json(['success' => true]);
    }
}
