<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $guarded = [];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'status' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'promotion_products');
    }

    public function danduongs()
    {
        return $this->belongsToMany(Danduong::class, 'promotion_danduong');
    }

    public function isValid()
    {
        if (!$this->status) return false;
        $now = now();
        if ($this->start_at && $now->lt($this->start_at)) return false;
        if ($this->end_at && $now->gt($this->end_at)) return false;
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) return false;
        return true;
    }

    public function calculateDiscount($subtotal)
    {
        if ($this->minimum_order_value && $subtotal < $this->minimum_order_value) {
            return 0;
        }

        if ($this->type === 'percent') {
            return round($subtotal * $this->value / 100, 0);
        }

        return min($this->value, $subtotal);
    }
}
