<?php

namespace Database\Seeders;

use App\Models\ResidentHistory;
use Illuminate\Database\Seeder;

class ResidentHistorySeeder extends Seeder
{
    public function run(): void
    {
        ResidentHistory::create([
            'house_id' => 1,
            'resident_id' => 1,
            'start_date' => '2025-01-01',
            'end_date' => null,
        ]);
    }
}