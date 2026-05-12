<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanduongNhom extends Model
{
    //
    protected $table = "danduong_nhom";

    protected $fillable = [
        "danduong_nhom_ten",
        "danduong_nhom_tieude",
        "macdinh"
    ];

    public function menus() {
        return $this->hasMany(
            Danduong::class, "danduong_nhom_id"
        );
    }
}
