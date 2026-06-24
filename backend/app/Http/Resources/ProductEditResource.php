<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductEditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            // Product

            'id' => $this->id,

            'sku' => $this->sku,

            'barcode' => $this->barcode,

            'product_type' => $this->product_type,

            'brand_id' => $this->brand_id,

            'thumbnail' => $this->thumbnail
                ? [
                    'id'   => $this->thumbnail->id,
                    'url'  => asset(
                        'storage/' .
                            $this->thumbnail->path
                    )
                ]
                : null,

            'published_at' => $this->published_at,

            'status' => $this->status,

            'featured' => $this->featured,

            'is_new' => $this->is_new,

            // Pricing

            'price' => $this->price,

            'sale_price' => $this->sale_price,

            'cost_price' => $this->cost_price,
            'discount_percent' => $this->discount_percent,
            'discount_type' => $this->discount_type,
            'discount_amount' => $this->discount_amount,

            // Inventory

            'stock' => $this->stock,

            'manage_stock' => $this->manage_stock,

            'stock_status' => $this->stock_status,

            // Category

            'category_ids' =>

            $this->categories
                ->pluck('id')
                ->values(),

            // Gallery

            'gallery' =>

            $this->gallery

                ->map(function ($item) {

                    return [

                        'id' => $item->id,

                        'url' => asset(
                            'storage/' .
                                $item->path
                        )

                    ];
                })
                ->values(),

            // Translations

            'translations' =>

            $this->translations

                ->keyBy('ngonngu')

                ->map(function ($item) {

                    return [

                        'name' =>
                        $item->ten,

                        'short_description' =>
                        $item->mota_ngan,

                        'content' =>
                        $item->noidung,

                        'seo_title' =>
                        $item->seo_title,

                        'seo_description' =>
                        $item->seo_description,

                        'seo_keywords' =>
                        $item->seo_keywords

                    ];
                }),

            // Slugs

            'slugs' =>

            $this->urls

                ->pluck(
                    'slug',
                    'ngonngu'
                ),

            // Attributes

            'attributes' =>

            $this->attributeValues

                ->mapWithKeys(function ($item) {

                    return [

                        $item
                            ->attribute
                            ->code

                        =>

                        $item
                            ->attribute_value_id

                    ];
                })

        ];
    }
}
