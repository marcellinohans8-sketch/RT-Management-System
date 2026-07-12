<?php

namespace Database\Seeders;

use App\Models\Resident;
use Illuminate\Database\Seeder;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        $permanentNames = [
            'Adi Pratama',
            'Budi Santoso',
            'Citra Lestari',
            'Dewi Anggraini',
            'Eko Saputra',
            'Farah Nabila',
            'Gilang Ramadhan',
            'Hana Maharani',
            'Irwan Setiawan',
            'Joko Wibowo',
            'Kartika Putri',
            'Lukman Hakim',
            'Maya Sari',
            'Naufal Hidayat',
            'Olivia Permata',
        ];

        $contractNames = [
            'Prasetyo Nugroho',
            'Rina Amelia',
            'Surya Wijaya',
        ];

        $residents = collect($permanentNames)
            ->map(function (string $name, int $index) {
                return [
                    'full_name' => $name,
                    'ktp_number' => sprintf('317123456789%04d', $index + 1),
                    'resident_status' => 'permanent',
                    'phone_number' => sprintf('08123456%04d', $index + 1),
                    'ktp_photo' => null,
                    'is_married' => $index % 3 !== 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->merge(collect($contractNames)->map(function (string $name, int $index) {
                return [
                    'full_name' => $name,
                    'ktp_number' => sprintf('317123456789%04d', $index + 16),
                    'resident_status' => 'contract',
                    'phone_number' => sprintf('08129876%04d', $index + 1),
                    'ktp_photo' => null,
                    'is_married' => $index !== 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }))
            ->all();

        Resident::upsert(
            $residents,
            ['ktp_number'],
            ['full_name', 'resident_status', 'phone_number', 'ktp_photo', 'is_married', 'updated_at']
        );
    }
}
