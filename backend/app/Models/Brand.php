<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    //
    protected $table = "brands";
    protected $fillable = [
        "logo_id",
        "status"
    ];

    public function translation() {
        return $this->hasMany(
            BrandNgonngu::class,'brand_id'
        );
    }

    public function products() {
        return $this->hasMany(
            Product::class, 'brand_id'
        );
    }

    public function logo()
    {
        return $this->belongsTo(
            Media::class,
            'logo_id'
        );
    }

}
