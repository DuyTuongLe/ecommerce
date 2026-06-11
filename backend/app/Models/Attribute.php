<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    protected $table = 'attributes';

    public $timestamps = true;

    protected $fillable = [

        'code',

        'type',

        'status'

    ];

    public function translations()
    {
        return $this->hasMany(
            AttributeNgonngu::class,
            'attribute_id'
        );
    }

    public function values()
    {
        return $this->hasMany(
            AttributeValue::class,
            'attribute_id'
        );
    }

    public function productValues()
    {
        return $this->hasMany(

            ProductAttributeValue::class,

            'attribute_id'

        );
    }
}
