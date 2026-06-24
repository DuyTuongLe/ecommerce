<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CauHinh extends Model
{
    protected $table = 'cauhinh';

    public $timestamps = false;

    protected $fillable = ['key_name', 'value'];
}
