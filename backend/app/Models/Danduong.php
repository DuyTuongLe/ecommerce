<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Danduong extends Model
{
    //
    protected $table = 'danduong';
    public $timestamps = true;

    public function ngonngu()
    {
        return $this->hasMany(DanduongNgonngu::class, 'danduong_id');
    }
}
