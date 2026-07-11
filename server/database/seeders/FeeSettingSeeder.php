<?php

namespace Database\Seeders;

use App\Models\FeeSetting;
use Illuminate\Database\Seeder;

class FeeSettingSeeder extends Seeder
{
    public function run(): void
    {
        FeeSetting::insert([
            [
                'type' => 'security',
                'amount' => 100000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'cleaning',
                'amount' => 15000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}