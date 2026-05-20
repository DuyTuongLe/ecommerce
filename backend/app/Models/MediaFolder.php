<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaFolder extends Model
{
    //

    protected $table = "media_folders";

    protected $fillable = [
        'parent_id',
        'name'
    ];

    public function parentMedia() {
        return $this->belongsTo(
            MediaFolder::class,"parent_id"
        );
    }

    public function children() {
        return $this->hasMany(
            MediaFolder::class,"parent_id"
        );
    }

    public function media() {
        return $this->hasMany(
            Media::class,"folder_id"
        );
    }
}
