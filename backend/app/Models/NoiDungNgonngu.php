<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoiDungNgonngu extends Model
{
    protected $table = 'noi_dung_ngonngu';

    protected $fillable = [
        'noi_dung_id',
        'ngonngu',
        'tieu_de',
        'noi_dung_json',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'custom',
    ];

    protected $casts = [
        'noi_dung_json' => 'array',
    ];

    public function noiDung()
    {
        return $this->belongsTo(
            NoiDung::class,
            'noi_dung_id'
        );
    }
}
