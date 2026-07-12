<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\ResidentHistory;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $year = (int) now()->year;
        $month = (int) now()->month;
        $securityFee = 100000;
        $cleaningFee = 15000;

        $histories = ResidentHistory::with('resident')
            ->whereNull('end_date')
            ->latest('start_date')
            ->get();

        foreach ($histories as $index => $history) {
            Payment::updateOrCreate(
                [
                    'resident_id' => $history->resident_id,
                    'month' => $month,
                    'year' => $year,
                ],
                [
                    'house_id' => $history->house_id,
                    'period_type' => 'monthly',
                    'period_start_month' => $month,
                    'period_end_month' => $month,
                    'security_fee' => $securityFee,
                    'cleaning_fee' => $cleaningFee,
                    'total' => $securityFee + $cleaningFee,
                    'status' => $index % 5 === 0 ? 'unpaid' : 'paid',
                    'paid_at' => $index % 5 === 0 ? null : now()->toDateString(),
                    'notes' => 'Contoh tagihan bulan berjalan',
                ]
            );
        }

        $annualHistory = $histories->firstWhere('resident.resident_status', 'permanent');

        if ($annualHistory) {
            Payment::updateOrCreate(
                [
                    'resident_id' => $annualHistory->resident_id,
                    'month' => 1,
                    'year' => $year,
                ],
                [
                    'house_id' => $annualHistory->house_id,
                    'period_type' => 'annual',
                    'period_start_month' => 1,
                    'period_end_month' => 12,
                    'security_fee' => $securityFee,
                    'cleaning_fee' => $cleaningFee * 12,
                    'total' => $securityFee + ($cleaningFee * 12),
                    'status' => 'paid',
                    'paid_at' => now()->startOfYear()->toDateString(),
                    'notes' => 'Contoh pembayaran kebersihan tahunan dan satpam bulan Januari',
                ]
            );
        }
    }
}
