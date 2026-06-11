<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttributeValue extends Model
{
    protected $table =
        'product_attribute_values';

    public $timestamps = true;

    protected $fillable = [

        'product_id',

        'attribute_id',

        'attribute_value_id'

    ];

    public function product()
    {
        return $this->belongsTo(

            Product::class,

            'product_id'

        );
    }

    public function attribute()
    {
        return $this->belongsTo(

            Attribute::class,

            'attribute_id'

        );
    }

    public function attributeValue()
    {
        return $this->belongsTo(

            AttributeValue::class,

            'attribute_value_id'

        );
    }
}