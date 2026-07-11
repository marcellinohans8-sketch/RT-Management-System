<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resident extends Model
{
    protected $fillable = [
        'full_name',
        'ktp_number',
        'resident_status',
        'phone_number',
        'is_married',
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