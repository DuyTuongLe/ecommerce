<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeNgonngu extends Model
{
    //
    protected $table = "attribute_ngonngu";

    public $timestamps = true;

    protected $fillable = [
        'attribute_id',

        'ngonngu',

        'ten'
    ];

    public function attribute() {
        return $this->belongsTo(
            Attribute::class,"attribute_id"
        );
    }
}
