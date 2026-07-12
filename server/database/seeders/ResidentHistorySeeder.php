<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\Resident;
use App\Models\ResidentHistory;
use Illuminate\Database\Seeder;

class ResidentHistorySeeder extends Seeder
{
    public function run(): void
    {
        $houses = House::all()->keyBy('house_number');
        $residents = Resident::whereBetween('ktp_number', [
            '3171234567890001',
            '3171234567890018',
        ])->get()->keyBy('ktp_number');

        foreach (range(1, 15) as $number) {
            $resident = $residents->get(sprintf('317123456789%04d', $number));

            ResidentHistory::updateOrCreate(
                [
                    'house_id' => $houses->get(sprintf('A-%02d', $number))->id,
                    'resident_id' => $resident->id,
                    'start_date' => '2025-01-01',
                ],
                ['end_date' => null]
            );
        }

        ResidentHistory::updateOrCreate(
            [
                'house_id' => $houses->get('B-01')->id,
                'resident_id' => $residents->get('3171234567890016')->id,
                'start_date' => '2026-01-01',
            ],
            ['end_date' => null]
        );

        ResidentHistory::updateOrCreate(
            [
                'house_id' => $houses->get('B-02')->id,
                'resident_id' => $residents->get('3171234567890017')->id,
                'start_date' => '2026-03-01',
            ],
            ['end_date' => null]
        );

        ResidentHistory::updateOrCreate(
            [
                'house_id' => $houses->get('B-03')->id,
                'resident_id' => $residents->get('3171234567890018')->id,
                'start_date' => '2025-08-01',
            ],
            ['end_date' => '2026-02-28']
        );
    }
}
