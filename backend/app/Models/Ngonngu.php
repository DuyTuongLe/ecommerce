<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ngonngu extends Model
{
    //
    protected $table = 'ngonngu';
    public $timestamps = false;

    protected $fillable = ['code', 'name', 'macdinh', 'status'];

    public function danduongNgonngu()
    {
        return $this->hasMany(DanduongNgonngu::class, 'ngonngu', 'code');
    }

    public function scopeActive($q)
    {
        return $q->where('status', 1);
    }
}
