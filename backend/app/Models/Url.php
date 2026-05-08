<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    //
    protected $table = 'url';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'redirect_to',
        'status',
        'slug',
        'ngonngu'
    ];
}
