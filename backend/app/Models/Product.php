<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $guarded = [];

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
}
