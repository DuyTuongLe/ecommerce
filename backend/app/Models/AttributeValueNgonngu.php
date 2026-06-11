<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeValueNgonngu extends Model
{
    //
    protected $table =
        'attribute_value_ngonngu';

    protected $fillable = [

        'attribute_value_id',

        'ngonngu',

        'ten'

    ];

    public function value()
    {
        return $this->belongsTo(

            AttributeValue::class,

            'attribute_value_id'

        );
    }
}
