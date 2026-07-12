<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\ResidentHistory;
use Carbon\Carbon;
class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with('resident')
                ->latest()
                ->get()
        );
    }

    public function store(StorePaymentRequest $request)
    {
        $payment = Payment::create($request->validated());

        return response()->json([
            'message' => 'Payment created successfully',
            'data' => $payment
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json(
            $payment->load('resident')
        );
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());

        return response()->json([
            'message' => 'Payment updated successfully',
            'data' => $payment
        ]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully'
        ]);
    }

  public function generateMonthlyBills()
{
    $now = Carbon::now();

    $month = $now->month;
    $year = $now->year;

    $securityFee = 100000;
    $cleaningFee = 15000;

    $histories = ResidentHistory::with(['resident', 'house'])
        ->whereNull('end_date')
        ->get();

    $created = 0;

    foreach ($histories as $history) {

        if ($history->house->status !== 'occupied') {
            continue;
        }

        if (!in_array($history->resident->resident_status, ['permanent', 'contract'])) {
            continue;
        }

        $paymentExists = Payment::where('resident_id', $history->resident_id)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        if ($paymentExists) {
            continue;
        }

        Payment::create([
            'resident_id' => $history->resident_id,
            'month' => $month,
            'year' => $year,
            'security_fee' => $securityFee,
            'cleaning_fee' => $cleaningFee,
            'total' => $securityFee + $cleaningFee,
            'status' => 'unpaid',
            'paid_at' => null,
        ]);

        $created++;
    }

    return response()->json([
        'message' => 'Monthly bills generated successfully',
        'month' => $month,
        'year' => $year,
        'created' => $created,
    ]);
}
}