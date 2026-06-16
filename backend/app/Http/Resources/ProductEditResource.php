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

            'thumbnail_id' => $this->thumbnail_id,

            'published_at' => $this->published_at,

            'status' => $this->status,

            'featured' => $this->featured,

            'is_new' => $this->is_new,

            // Pricing

            'price' => $this->price,

            'sale_price' => $this->sale_price,

            'cost_price' => $this->cost_price,

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

            'gallery_ids' =>

                $this->gallery
                    ->pluck('id')
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