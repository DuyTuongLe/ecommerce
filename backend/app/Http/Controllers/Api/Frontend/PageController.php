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

    public function byCustom(Request $request, $custom)
    {
        $lang = $request->get('lang', 'vi');

        $items = NoiDung::query()
            ->leftJoin('noi_dung_ngonngu', function ($join) use ($lang) {
                $join->on('noi_dung.id', '=', 'noi_dung_ngonngu.noi_dung_id')
                    ->where('noi_dung_ngonngu.ngonngu', $lang);
            })
            ->leftJoin('media', 'noi_dung.thumbnail_id', '=', 'media.id')
            ->where('noi_dung_ngonngu.custom', $custom)
            ->where('noi_dung.trangthai', 1)
            ->select([
                'noi_dung.id',
                'noi_dung.type',
                'noi_dung_ngonngu.tieu_de as title',
                'noi_dung_ngonngu.noi_dung_json',
                'media.path as thumbnail',
            ])
            ->orderBy('noi_dung.thutu')
            ->get();

        $items->transform(function ($item) {
            $item->thumbnail = $item->thumbnail ? asset('storage/' . $item->thumbnail) : null;
            if (is_string($item->noi_dung_json)) {
                $item->noi_dung_json = json_decode($item->noi_dung_json, true);
            }
            return $item;
        });

        return response()->json($items);
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

        if ($page->type === 'blog') {
            $categoryIds = $this->getDescendantIds($danduongId);

            $posts = NoiDung::query()
                ->leftJoin('noi_dung_ngonngu', function ($join) use ($lang) {
                    $join->on('noi_dung.id', '=', 'noi_dung_ngonngu.noi_dung_id')
                        ->where('noi_dung_ngonngu.ngonngu', $lang);
                })
                ->leftJoin('media', 'noi_dung.thumbnail_id', '=', 'media.id')
                ->leftJoin('url', function ($join) use ($lang) {
                    $join->on('noi_dung.id', '=', 'url.entity_id')
                        ->where('url.entity_type', 'noi_dung')
                        ->where('url.ngonngu', $lang);
                })
                ->whereIn('noi_dung.danduong_id', $categoryIds)
                ->where('noi_dung.type', 'blog')
                ->where('noi_dung.trangthai', 1)
                ->select([
                    'noi_dung.id',
                    'noi_dung.created_at',
                    'noi_dung_ngonngu.tieu_de as title',
                    'noi_dung_ngonngu.seo_description as excerpt',
                    'media.path as thumbnail',
                    'url.slug',
                ])
                ->orderBy('noi_dung.created_at', 'desc')
                ->paginate(12);

            $posts->getCollection()->transform(function ($item) {
                $item->thumbnail = $item->thumbnail ? asset('storage/' . $item->thumbnail) : null;
                return $item;
            });

            // Get sibling/child categories for navigation
            $currentCat = Danduong::find($danduongId);
            $childrenOfCurrent = Danduong::where('goc_id', $danduongId)
                ->where('type', 'blog')->where('trangthai', 1)->count();

            // If current has children → show children; otherwise show siblings
            $siblingParentId = $childrenOfCurrent > 0
                ? $danduongId
                : ($currentCat->goc_id ?? $danduongId);

            $children = Danduong::query()
                ->leftJoin('danduong_ngonngu', function ($join) use ($lang) {
                    $join->on('danduong.id', '=', 'danduong_ngonngu.danduong_id')
                        ->where('danduong_ngonngu.ngonngu', $lang);
                })
                ->leftJoin('url as u', function ($join) use ($lang) {
                    $join->on('danduong.id', '=', 'u.entity_id')
                        ->where('u.entity_type', 'danduong')
                        ->where('u.ngonngu', $lang);
                })
                ->where('danduong.goc_id', $siblingParentId)
                ->where('danduong.type', 'blog')
                ->where('danduong.trangthai', 1)
                ->select([
                    'danduong.id',
                    'danduong_ngonngu.danduong_nn_ten as name',
                    'u.slug',
                ])
                ->orderBy('danduong.thutu')
                ->get();

            return response()->json([
                'type' => 'blog',
                'title' => $page->title,
                'current_id' => $danduongId,
                'seo_title' => $page->seo_title,
                'seo_description' => $page->seo_description,
                'children' => $children,
                'posts' => $posts,
                'alternate_slugs' => $this->getAlternateSlugs('danduong', $danduongId),
                'breadcrumbs' => $this->getBreadcrumbs($danduongId, $lang),
            ]);
        }

        if (in_array($page->type, ['product_category', 'menu_group'])) {
            return response()->json([
                'type' => 'product_category',
                'category_id' => $page->id,
                'title' => $page->title,
                'seo_title' => $page->seo_title,
                'seo_description' => $page->seo_description,
                'alternate_slugs' => $this->getAlternateSlugs('danduong', $danduongId),
                'breadcrumbs' => $this->getBreadcrumbs($danduongId, $lang),
            ]);
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
            'breadcrumbs' => $this->getBreadcrumbs($danduongId, $lang),
        ]);
    }

    protected function getBreadcrumbs($danduongId, $lang)
    {
        $crumbs = [];
        $current = Danduong::find($danduongId);

        while ($current && !$current->macdinh) {
            $trans = $current->ngonngus()->where('ngonngu', $lang)->first();
            $url = Url::where('entity_type', 'danduong')
                ->where('entity_id', $current->id)
                ->where('ngonngu', $lang)
                ->first();

            $crumbs[] = [
                'title' => $trans?->danduong_nn_ten ?? '',
                'slug' => $url?->slug,
            ];

            $current = $current->goc_id ? Danduong::find($current->goc_id) : null;
        }

        return array_reverse($crumbs);
    }

    protected function getDescendantIds($danduongId)
    {
        $ids = [$danduongId];
        $parentIds = [$danduongId];

        while (!empty($parentIds)) {
            $childIds = Danduong::whereIn('goc_id', $parentIds)
                ->where('type', 'blog')
                ->where('trangthai', 1)
                ->pluck('id')
                ->all();

            $ids = array_merge($ids, $childIds);
            $parentIds = $childIds;
        }

        return $ids;
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
                'noi_dung.image_settings',
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
        if (is_string($content->image_settings)) {
            $content->image_settings = json_decode($content->image_settings, true);
        }

        $noiDung = NoiDung::find($noiDungId);
        $breadcrumbs = $noiDung?->danduong_id
            ? $this->getBreadcrumbs($noiDung->danduong_id, $lang)
            : [];

        if ($content->title) {
            $breadcrumbs[] = ['title' => $content->title, 'slug' => null];
        }

        return response()->json([
            'type' => 'content',
            'content' => $content,
            'alternate_slugs' => $this->getAlternateSlugs('noi_dung', $noiDungId),
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
