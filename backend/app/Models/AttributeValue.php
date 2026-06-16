<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    //
    protected $table =
    'attribute_values';

    protected $fillable = [

        'attribute_id',

        'code',

        'color_code',

        'thutu',

        'status'

    ];

    public function attribute()
    {
        return $this->belongsTo(
            Attribute::class,
            'attribute_id'
        );
    }

    public function translations()
    {
        return $this->hasMany(
            AttributeValueNgonngu::class,
            'attribute_value_id'
        );
    }

    public function products()
    {
        return $this->hasMany(

            ProductAttributeValue::class,

            'attribute_value_id'

        );
    }
}
