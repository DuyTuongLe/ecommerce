<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $guarded = [];

    protected $casts = [
        'status' => 'boolean',
        'featured' => 'boolean',
        'is_new' => 'boolean',
        'manage_stock' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function translations()
    {
        return $this->hasMany(
            ProductNgonngu::class,
            'product_id'
        );
    }

    public function thumbnail()
    {
        return $this->belongsTo(
            Media::class,
            'thumbnail_id'
        );
    }

    public function attributeValues()
    {
        return $this->hasMany(

            ProductAttributeValue::class,

            'product_id'

        );
    }

    public function categories()
    {
        return $this->belongsToMany(
            DanDuong::class,
            'product_danduong',
            'product_id',
            'danduong_id'
        );
    }

    public function gallery()
    {
        return $this->belongsToMany(
            Media::class,
            'product_media',
            'product_id',
            'media_id'
        );
    }

    public function brand()
    {
        return $this->belongsTo(
            Brand::class,
            'brand_id'
        );
    }

    public function urls()
    {
        return $this->hasMany(
            Url::class,
            'entity_id'
        )->where(
            'entity_type',
            'product'
        );
    }
}
