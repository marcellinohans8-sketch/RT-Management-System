<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'resident_id',
        'house_id',
        'month',
        'year',
        'period_type',
        'period_start_month',
        'period_end_month',
        'security_fee',
        'cleaning_fee',
        'total',
        'status',
        'paid_at',
        'notes',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }
}
