<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Url;
use App\Models\NoiDung;
use App\Models\NoiDungNgonngu;
use App\Models\Danduong;

class PageController extends Controller
{
    public function show(Request $request, $slug)
    {
        $lang = $request->get('lang', 'vi');

        $url = Url::where('slug', $slug)
            ->where('ngonngu', $lang)
            ->first();

        if (!$url) {
            return response()->json(['error' => 'Not found'], 404);
        }

        if ($url->entity_type === 'danduong') {
            return $this->getPage($url->entity_id, $lang);
        }

        if ($url->entity_type === 'noi_dung') {
            return $this->getContent($url->entity_id, $lang);
        }

        if ($url->entity_type === 'product') {
            return response()->json([
                'type' => 'product',
                'entity_id' => $url->entity_id,
                'alternate_slugs' => $this->getAlternateSlugs('product', $url->entity_id),
            ]);
        }

        return response()->json(['error' => 'Not found'], 404);
    }

    public function home(Request $request)
    {
        $lang = $request->get('lang', 'vi');

        $homepage = Danduong::where('macdinh', 1)
            ->where('type', 'page')
            ->first();

        if (!$homepage) {
            return response()->json(['error' => 'No homepage configured'], 404);
        }

        return $this->getPage($homepage->id, $lang);
    }

    protected function getAlternateSlugs($entityType, $entityId)
    {
        $slugs = [];
        $urls = Url::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->get();
        foreach ($urls as $u) {
            $slugs[$u->ngonngu] = $u->slug;
        }
        return $slugs;
    }

    protected function getPage($danduongId, $lang)
    {
        $page = Danduong::query()
            ->leftJoin('danduong_ngonngu', function ($join) use ($lang) {
                $join->on('danduong.id', '=', 'danduong_ngonngu.danduong_id')
                    ->where('danduong_ngonngu.ngonngu', $lang);
            })
            ->where('danduong.id', $danduongId)
            ->select([
                'danduong.id',
                'danduong.type',
                'danduong_ngonngu.danduong_nn_ten as title',
                'danduong_ngonngu.mota as description',
                'danduong_ngonngu.seo_title',
                'danduong_ngonngu.seo_description',
                'danduong_ngonngu.seo_keywords',
            ])
            ->first();

        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $sections = NoiDung::query()
            ->leftJoin('noi_dung_ngonngu', function ($join) use ($lang) {
                $join->on('noi_dung.id', '=', 'noi_dung_ngonngu.noi_dung_id')
                    ->where('noi_dung_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'noi_dung.thumbnail_id', '=', 'media.id')
            ->where('noi_dung.danduong_id', $danduongId)
            ->where('noi_dung.trangthai', 1)
            ->select([
                'noi_dung.id',
                'noi_dung.type',
                'noi_dung.thutu',
                'noi_dung_ngonngu.tieu_de as title',
                'noi_dung_ngonngu.noi_dung_json',
                'media.path as thumbnail',
            ])
            ->orderBy('noi_dung.thutu')
            ->orderBy('noi_dung.id')
            ->get();

        $sections->transform(function ($item) {
            $item->thumbnail = $item->thumbnail
                ? asset('storage/' . $item->thumbnail)
                : null;
            if (is_string($item->noi_dung_json)) {
                $item->noi_dung_json = json_decode($item->noi_dung_json, true);
            }
            return $item;
        });

        return response()->json([
            'type' => 'page',
            'page' => $page,
            'sections' => $sections,
            'alternate_slugs' => $this->getAlternateSlugs('danduong', $danduongId),
        ]);
    }

    protected function getContent($noiDungId, $lang)
    {
        $content = NoiDung::query()
            ->leftJoin('noi_dung_ngonngu', function ($join) use ($lang) {
                $join->on('noi_dung.id', '=', 'noi_dung_ngonngu.noi_dung_id')
                    ->where('noi_dung_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'noi_dung.thumbnail_id', '=', 'media.id')
            ->where('noi_dung.id', $noiDungId)
            ->where('noi_dung.trangthai', 1)
            ->select([
                'noi_dung.id',
                'noi_dung.type',
                'noi_dung.created_at',
                'noi_dung_ngonngu.tieu_de as title',
                'noi_dung_ngonngu.noi_dung_json',
                'noi_dung_ngonngu.seo_title',
                'noi_dung_ngonngu.seo_description',
                'noi_dung_ngonngu.seo_keywords',
                'media.path as thumbnail',
            ])
            ->first();

        if (!$content) {
            return response()->json(['error' => 'Content not found'], 404);
        }

        $content->thumbnail = $content->thumbnail
            ? asset('storage/' . $content->thumbnail)
            : null;

        if (is_string($content->noi_dung_json)) {
            $content->noi_dung_json = json_decode($content->noi_dung_json, true);
        }

        return response()->json([
            'type' => 'content',
            'content' => $content,
            'alternate_slugs' => $this->getAlternateSlugs('noi_dung', $noiDungId),
        ]);
    }
}
