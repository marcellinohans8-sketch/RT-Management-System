<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        Expense::create([
            'title' => 'Perbaikan Jalan',
            'category' => 'road',
            'description' => 'Perbaikan jalan lingkungan',
            'amount' => 500000,
            'expense_date' => now(),
        ]);
    }
}