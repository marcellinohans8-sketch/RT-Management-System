<?php

namespace Database\Seeders;

use App\Models\House;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    public function run(): void
    {
        $houses = collect(range(1, 20))->map(function (int $number) {
            $block = $number <= 15 ? 'A' : 'B';
            $houseNumber = sprintf('%s-%02d', $block, $number <= 15 ? $number : $number - 15);

            return [
                'house_number' => $houseNumber,
                'address' => sprintf('Jl. Melati Blok %s No.%d', $block, $number <= 15 ? $number : $number - 15),
                'notes' => $number <= 15
                    ? 'Rumah penghuni tetap'
                    : 'Rumah cadangan untuk penghuni kontrak/sementara',
                'status' => $number <= 17 ? 'occupied' : 'vacant',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->all();

        House::upsert(
            $houses,
            ['house_number'],
            ['address', 'notes', 'status', 'updated_at']
        );
    }
}
