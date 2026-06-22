<?php

namespace App\Services;

use App\Models\Url;
use Illuminate\Support\Str;

class SlugService
{
    public static function generate($data)
    {
        $text =
            $data['text'] ?? '';

        $entityType =
            $data['entity_type'] ?? '';

        $entityId =
            $data['entity_id'] ?? null;

        $language =
            $data['ngonngu'] ?? 'vi';

        /*
    |--------------------------------------------------------------------------
    | Base Slug
    |--------------------------------------------------------------------------
    */

        $baseSlug =
            Str::slug($text);

        /*
    |--------------------------------------------------------------------------
    | Empty Fallback
    |--------------------------------------------------------------------------
    */

        if (empty($baseSlug)) {

            $baseSlug = 'n-a';
        }

        $slug = $baseSlug;

        $counter = 1;

        /*
    |--------------------------------------------------------------------------
    | Unique Check
    |--------------------------------------------------------------------------
    */

        while (

            Url::query()

            ->where(
                'slug',
                $slug
            )

            ->where(
                'ngonngu',
                $language
            )

            ->when(

                $entityId,

                function ($query)
                use ($entityId) {

                    $query->where(
                        'entity_id',
                        '!=',
                        $entityId
                    );
                }

            )

            ->exists()

        ) {

            $slug =
                $baseSlug .
                '-' .
                $counter;

            $counter++;
        }

        return $slug;
    }
}
