<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandNgonngu extends Model
{
    //
    protected $table = 'brand_ngonngu';

    protected $fillable = [

        'brand_id',

        'ngonngu',

        'ten',

        'mota',

        'seo_title',

        'seo_description',

        'seo_keywords'

    ];

    public $timestamps = false;

    public function brand()
    {
        return $this->belongsTo(
            Brand::class,
            'brand_id'
        );
    }
}
