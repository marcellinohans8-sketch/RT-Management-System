<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalResidents = Resident::count();

        $totalHouses = House::count();

        $occupiedHouses = House::where('status', 'occupied')->count();

        $vacantHouses = House::where('status', 'vacant')->count();

        $totalIncome = (float) Payment::where('status', 'paid')->sum('total');

        $totalExpense = (float) Expense::sum('amount');

        $cashBalance = $totalIncome - $totalExpense;

        return response()->json([
            'total_residents' => $totalResidents,
            'total_houses' => $totalHouses,
            'occupied_houses' => $occupiedHouses,
            'vacant_houses' => $vacantHouses,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'cash_balance' => $cashBalance,
        ]);
    }

    public function chart()
    {
        $income = Payment::select(
                'month',
                DB::raw('SUM(total) as total_income')
            )
            ->where('status', 'paid')
            ->where('year', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $expense = Expense::select(
                DB::raw('MONTH(expense_date) as month'),
                DB::raw('SUM(amount) as total_expense')
            )
            ->whereYear('expense_date', date('Y'))
            ->groupBy(DB::raw('MONTH(expense_date)'))
            ->orderBy(DB::raw('MONTH(expense_date)'))
            ->get();

        return response()->json([
            'income' => $income,
            'expense' => $expense,
        ]);
    }
}