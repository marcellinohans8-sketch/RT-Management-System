<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FeeSettingSeeder::class,
            HouseSeeder::class,
            ResidentSeeder::class,
            ResidentHistorySeeder::class,
            PaymentSeeder::class,
            ExpenseSeeder::class,
        ]);
    }
}