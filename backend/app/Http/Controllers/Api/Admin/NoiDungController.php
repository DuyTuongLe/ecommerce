<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NoiDung;
use App\Models\NoiDungNgonngu;
use App\Models\Danduong;
use App\Models\Url;
use App\Services\SlugService;
use Illuminate\Support\Facades\DB;

class NoiDungController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->get('lang', 'vi');
        $type = $request->get('type');
        $danduongId = $request->get('danduong_id');

        $query = NoiDung::query()
            ->leftJoin(
                'noi_dung_ngonngu',
                function ($join) use ($lang) {
                    $join
                        ->on(
                            'noi_dung.id',
                            '=',
                            'noi_dung_ngonngu.noi_dung_id'
                        )
                        ->where(
                            'noi_dung_ngonngu.ngonngu',
                            $lang
                        );
                }
            )
            ->leftJoin(
                'danduong_ngonngu',
                function ($join) use ($lang) {
                    $join
                        ->on(
                            'noi_dung.danduong_id',
                            '=',
                            'danduong_ngonngu.danduong_id'
                        )
                        ->where(
                            'danduong_ngonngu.ngonngu',
                            $lang
                        );
                }
            )
            ->leftJoin(
                'media',
                'noi_dung.thumbnail_id',
                '=',
                'media.id'
            );

        if ($type) {
            $query->where('noi_dung.type', $type);
        }

        if ($danduongId) {
            $query->where('noi_dung.danduong_id', $danduongId);
        }

        $items = $query
            ->select([
                'noi_dung.id',
                'noi_dung.danduong_id',
                'noi_dung.type',
                'noi_dung.thutu',
                'noi_dung.trangthai',
                'noi_dung.created_at',
                DB::raw(
                    'COALESCE('
                    . 'noi_dung_ngonngu.tieu_de, '
                    . '(SELECT nn2.tieu_de FROM noi_dung_ngonngu nn2 '
                    . 'WHERE nn2.noi_dung_id = noi_dung.id '
                    . 'ORDER BY nn2.id ASC LIMIT 1)'
                    . ') as title'
                ),
                'danduong_ngonngu.danduong_nn_ten as page_name',
                'media.path as thumbnail',
            ])
            ->orderBy('noi_dung.thutu')
            ->orderBy('noi_dung.id', 'desc')
            ->get();

        $items->transform(function ($item) {
            $item->thumbnail = $item->thumbnail
                ? asset('storage/' . $item->thumbnail)
                : null;
            return $item;
        });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        $noiDung = NoiDung::create([
            'danduong_id' => $request->input('danduong_id'),
            'type' => $request->input('type', 'section'),
            'thumbnail_id' => $request->input('thumbnail_id'),
            'thutu' => $request->input('thutu', 0),
            'trangthai' => $request->input('trangthai', 1),
        ]);

        NoiDungNgonngu::create([
            'noi_dung_id' => $noiDung->id,
            'ngonngu' => $lang,
            'tieu_de' => $request->input('tieu_de', ''),
            'noi_dung_json' => $request->input('noi_dung_json'),
            'seo_title' => $request->input('seo_title'),
            'seo_description' => $request->input('seo_description'),
            'seo_keywords' => $request->input('seo_keywords'),
        ]);

        $this->saveSlug(
            $noiDung->id,
            $request->input('tieu_de', ''),
            $lang
        );

        return response()->json([
            'success' => true,
            'id' => $noiDung->id,
        ]);
    }

    public function show($id)
    {
        $noiDung = NoiDung::with([
            'translations',
            'thumbnail',
        ])->findOrFail($id);

        $translations = [];

        foreach ($noiDung->translations as $t) {
            $translations[$t->ngonngu] = [
                'tieu_de' => $t->tieu_de,
                'noi_dung_json' => $t->noi_dung_json,
                'seo_title' => $t->seo_title,
                'seo_description' => $t->seo_description,
                'seo_keywords' => $t->seo_keywords,
            ];
        }

        $slugs = [];
        $urls = Url::where('entity_type', 'noi_dung')
            ->where('entity_id', $noiDung->id)
            ->get();
        foreach ($urls as $url) {
            $slugs[$url->ngonngu] = $url->slug;
        }

        return response()->json([
            'id' => $noiDung->id,
            'danduong_id' => $noiDung->danduong_id,
            'type' => $noiDung->type,
            'thumbnail_id' => $noiDung->thumbnail_id,
            'thumbnail' => $noiDung->thumbnail
                ? [
                    'id' => $noiDung->thumbnail->id,
                    'url' => asset('storage/' . $noiDung->thumbnail->path),
                ]
                : null,
            'thutu' => $noiDung->thutu,
            'trangthai' => $noiDung->trangthai,
            'created_at' => $noiDung->created_at,
            'translations' => $translations,
            'slugs' => $slugs,
        ]);
    }

    public function update(Request $request, $id)
    {
        $lang = $request->get('lang', 'vi');
        $noiDung = NoiDung::findOrFail($id);

        $noiDung->update([
            'danduong_id' => $request->input('danduong_id'),
            'type' => $request->input('type', $noiDung->type),
            'thumbnail_id' => $request->input('thumbnail_id'),
            'thutu' => $request->input('thutu', $noiDung->thutu),
            'trangthai' => $request->input('trangthai', $noiDung->trangthai),
        ]);

        NoiDungNgonngu::updateOrCreate(
            [
                'noi_dung_id' => $noiDung->id,
                'ngonngu' => $lang,
            ],
            [
                'tieu_de' => $request->input('tieu_de'),
                'noi_dung_json' => $request->input('noi_dung_json'),
                'seo_title' => $request->input('seo_title'),
                'seo_description' => $request->input('seo_description'),
                'seo_keywords' => $request->input('seo_keywords'),
            ]
        );

        $slug = $request->input('slug');
        $title = $request->input('tieu_de', '');
        $this->saveSlug($noiDung->id, $slug ?: $title, $lang);

        return response()->json([
            'success' => true,
            'message' => 'Content updated successfully',
        ]);
    }

    public function toggleStatus(Request $request)
    {
        $noiDung = NoiDung::findOrFail($request->input('id'));
        $noiDung->update([
            'trangthai' => $request->input('trangthai', 0),
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request)
    {
        $ids = $request->input('ids', []);

        Url::where('entity_type', 'noi_dung')
            ->whereIn('entity_id', $ids)
            ->delete();

        NoiDung::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    public function pages(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        return response()->json(
            Danduong::query()
                ->leftJoin('danduong_ngonngu', function ($join) use ($lang) {
                    $join->on('danduong.id', '=', 'danduong_ngonngu.danduong_id')
                        ->where('danduong_ngonngu.ngonngu', $lang);
                })
                ->where('danduong.type', 'page')
                ->select([
                    'danduong.id as value',
                    'danduong_ngonngu.danduong_nn_ten as label',
                ])
                ->orderBy('danduong.thutu')
                ->get()
        );
    }

    public function reorder(Request $request)
    {
        $items = $request->input('items', []);

        foreach ($items as $item) {
            NoiDung::where('id', $item['id'])
                ->update(['thutu' => $item['thutu']]);
        }

        return response()->json([
            'success' => true,
        ]);
    }

    protected function saveSlug($noiDungId, $text, $lang)
    {
        $slug = SlugService::generate([
            'text' => $text,
            'entity_type' => 'noi_dung',
            'entity_id' => $noiDungId,
            'ngonngu' => $lang,
        ]);

        Url::updateOrCreate(
            [
                'entity_type' => 'noi_dung',
                'entity_id' => $noiDungId,
                'ngonngu' => $lang,
            ],
            [
                'slug' => $slug,
                'status' => 1,
            ]
        );
    }
}
