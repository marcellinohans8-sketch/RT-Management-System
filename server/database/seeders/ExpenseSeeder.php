<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $expenses = [
            [
                'title' => 'Gaji Satpam',
                'category' => 'security',
                'description' => 'Gaji satpam lingkungan bulan berjalan',
                'amount' => 1800000,
                'expense_date' => now()->startOfMonth()->addDays(4)->toDateString(),
            ],
            [
                'title' => 'Token Listrik Pos Satpam',
                'category' => 'security',
                'description' => 'Pembelian token listrik pos satpam',
                'amount' => 200000,
                'expense_date' => now()->startOfMonth()->addDays(9)->toDateString(),
            ],
            [
                'title' => 'Perbaikan Jalan',
                'category' => 'road',
                'description' => 'Perbaikan jalan lingkungan',
                'amount' => 500000,
                'expense_date' => now()->startOfMonth()->addDays(14)->toDateString(),
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::updateOrCreate(
                [
                    'title' => $expense['title'],
                    'expense_date' => $expense['expense_date'],
                ],
                $expense
            );
        }
    }
}
