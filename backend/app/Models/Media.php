<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    //
    protected $table = "media";

    protected $fillable = [
        'folder_id',
        'disk',
        'path',
        'filename',
        'mime_type',
        'extension',
        'size',
        'width',
        'height',
        'alt'
    ];

    protected $appends = [
        'url'
    ];

    public function folder()
    {
        return $this->belongsTo(
            MediaFolder::class,
            'folder_id'
        );
    }

    public function getUrlAttribute()
    {
        return asset(
            'storage/' . $this->path
        );
    }

    public function menus() {
        return $this->hasMany(Danduong::class,"thumbnail_id");
    }
}
