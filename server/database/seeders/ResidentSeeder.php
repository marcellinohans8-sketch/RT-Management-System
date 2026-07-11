<?php

namespace Database\Seeders;

use App\Models\Resident;
use Illuminate\Database\Seeder;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        Resident::insert([
            [
                'full_name' => 'Hans Marcellino',
                'ktp_number' => '3171234567890001',
                'resident_status' => 'permanent',
                'phone_number' => '081234567890',
                'is_married' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'full_name' => 'Budi Santoso',
                'ktp_number' => '3171234567890002',
                'resident_status' => 'contract',
                'phone_number' => '081298765432',
                'is_married' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}