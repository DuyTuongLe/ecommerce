<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    //
    protected $table = 'url';

    public function danduong()
    {
        return $this->belongsTo(Danduong::class, 'entity_id');
    }
}
