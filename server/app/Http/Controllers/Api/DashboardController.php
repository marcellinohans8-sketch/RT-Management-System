<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;

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
}