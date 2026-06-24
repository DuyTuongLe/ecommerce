<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class NguoiDung extends Authenticatable
{
    protected $table = 'nguoidung';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'trangthai',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'trangthai' => 'boolean',
        ];
    }
}
