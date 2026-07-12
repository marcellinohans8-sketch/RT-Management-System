<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class House extends Model
{
    protected $fillable = [
        'house_number',
        'address',
        'status',
        'notes',
    ];

    public function residentHistories(): HasMany
    {
        return $this->hasMany(ResidentHistory::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
