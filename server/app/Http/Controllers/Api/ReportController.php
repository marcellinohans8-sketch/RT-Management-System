<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function monthly(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
        ]);

        $month = $validated['month'];
        $year = $validated['year'];

        $payments = Payment::with('resident')
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $expenses = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get();

        $totalIncome = $payments
            ->where('status', 'paid')
            ->sum('total');

        $totalExpense = $expenses->sum('amount');

        return response()->json([
            'month' => $month,
            'year' => $year,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'cash_balance' => $totalIncome - $totalExpense,
            'payments' => $payments,
            'expenses' => $expenses,
        ]);
    }
}