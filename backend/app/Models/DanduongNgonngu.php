<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanduongNgonngu extends Model
{
    //
    protected $table = 'danduong_ngonngu';

    protected $fillable = [
        'danduong_id',
        'danduong_nn_ten',
        'mota',
        'seo_title',
        'seo_description',
        'seo_keywork',
        'ngonngu',
        'external_url'
    ];

    public function danduong()
    {
        return $this->belongsTo(Danduong::class,'danduong_id');
    }
}
