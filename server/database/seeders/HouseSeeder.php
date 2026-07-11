<?php

namespace Database\Seeders;

use App\Models\House;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    public function run(): void
    {
        House::insert([
            [
                'house_number' => 'A-01',
                'address' => 'Jl. Melati No.1',
                'notes' => null,
                'status' => 'occupied',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'house_number' => 'A-02',
                'address' => 'Jl. Melati No.2',
                'notes' => null,
                'status' => 'vacant',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}