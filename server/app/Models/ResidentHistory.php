<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResidentHistory extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'start_date',
        'end_date',
    ];

  public function resident()
{
    return $this->belongsTo(Resident::class);
}

public function house()
{
    return $this->belongsTo(House::class);
}
}