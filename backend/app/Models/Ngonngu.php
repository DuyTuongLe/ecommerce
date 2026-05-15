<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ngonngu extends Model
{
    //

    protected $table = "ngonngu";

    protected $fillable = [
        "code",
        "name",
        "macdinh",
        "status"
    ];

    public $timestamps = false;
}
