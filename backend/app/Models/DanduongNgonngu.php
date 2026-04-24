<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanduongNgonngu extends Model
{
    //
    protected $table = 'danduong_ngonngu';

    public function language() {
        return $this->belongsTo(Ngonngu::class, 'ngonngu', 'code');
    }
}
