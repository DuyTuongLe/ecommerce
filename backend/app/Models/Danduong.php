<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Danduong extends Model
{
    //
    protected $table = 'danduong';

    protected $fillable = [
        'goc_id',
        'danduong_nhom_id',
        'type',
        'thumbnail',
        'thutu',
        'trangthai',
        'macdinh',
        'target',
        'external_url'
    ];

    public function ngonngus() {
        return $this->hasMany(DanduongNgonngu::class,'danduong_id');
    }

    public function urls() 
    {
        return $this->hasMany(Url::class,'entity_id')->where('entity_type','danduong');
    }

    public function parent()
    {
        return $this->belongsTo(Danduong::class,'goc_id');
    }

    public function children()
    {
        return $this->hasMany(Danduong::class.'goc_id');
    }

    public function group()
    {
        return $this->belongsTo(DanduongNhom::class, "danduong_nhom_id");
    }
}
