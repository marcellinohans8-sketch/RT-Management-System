<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        Payment::create([
            'resident_id' => 1,
            'month' => 1,
            'year' => 2026,
            'security_fee' => 100000,
            'cleaning_fee' => 15000,
            'total' => 115000,
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }
}