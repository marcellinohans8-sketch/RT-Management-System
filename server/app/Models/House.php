<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class House extends Model
{
    protected $fillable = [
        'house_number',
        'address',
        'notes',
        'status',
    ];

    public function residentHistories(): HasMany
    {
        return $this->hasMany(ResidentHistory::class);
    }
}