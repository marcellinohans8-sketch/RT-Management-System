<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $payments = Payment::with(['resident', 'house'])
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $expenses = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get();

        $totalIncome = $payments
            ->where('status', 'paid')
            ->sum('total');

        $totalReceivable = $payments->sum('total');
        $totalUnpaid = $payments
            ->where('status', 'unpaid')
            ->sum('total');
        $totalExpense = $expenses->sum('amount');

        return response()->json([
            'month' => $month,
            'year' => $year,
            'total_income' => $totalIncome,
            'total_receivable' => $totalReceivable,
            'total_unpaid' => $totalUnpaid,
            'total_expense' => $totalExpense,
            'cash_balance' => $totalIncome - $totalExpense,
            'payments' => $payments,
            'expenses' => $expenses,
        ]);
    }

    public function yearly(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2024',
        ]);

        $year = $validated['year'];

        $income = Payment::select(
                'month',
                DB::raw('SUM(total) as total_income')
            )
            ->where('status', 'paid')
            ->where('year', $year)
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $expense = Expense::select(
                DB::raw('MONTH(expense_date) as month'),
                DB::raw('SUM(amount) as total_expense')
            )
            ->whereYear('expense_date', $year)
            ->groupBy(DB::raw('MONTH(expense_date)'))
            ->get()
            ->keyBy('month');

        $months = collect(range(1, 12))->map(function ($month) use ($income, $expense) {
            $totalIncome = (float) optional($income->get($month))->total_income;
            $totalExpense = (float) optional($expense->get($month))->total_expense;

            return [
                'month' => $month,
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'cash_balance' => $totalIncome - $totalExpense,
            ];
        });

        return response()->json([
            'year' => $year,
            'months' => $months,
            'total_income' => $months->sum('total_income'),
            'total_expense' => $months->sum('total_expense'),
            'cash_balance' => $months->sum('cash_balance'),
        ]);
    }
}
