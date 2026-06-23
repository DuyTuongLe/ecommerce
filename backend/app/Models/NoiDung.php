<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoiDung extends Model
{
    protected $table = 'noi_dung';

    protected $fillable = [
        'danduong_id',
        'type',
        'thumbnail_id',
        'thutu',
        'trangthai',
    ];

    protected $casts = [
        'trangthai' => 'boolean',
    ];

    public function translations()
    {
        return $this->hasMany(
            NoiDungNgonngu::class,
            'noi_dung_id'
        );
    }

    public function page()
    {
        return $this->belongsTo(
            Danduong::class,
            'danduong_id'
        );
    }

    public function thumbnail()
    {
        return $this->belongsTo(
            Media::class,
            'thumbnail_id'
        );
    }
}
