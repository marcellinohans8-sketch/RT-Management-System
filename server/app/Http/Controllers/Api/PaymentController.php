<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\ResidentHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with(['resident', 'house'])
                ->latest()
                ->get()
        );
    }

    public function store(StorePaymentRequest $request)
    {
        $data = $this->preparePaymentData($request->validated());

        $payment = Payment::create($data);

        return response()->json([
            'message' => 'Pembayaran berhasil ditambahkan',
            'data' => $payment->load(['resident', 'house'])
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json(
            $payment->load(['resident', 'house'])
        );
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $data = $this->preparePaymentData($request->validated());

        $payment->update($data);

        return response()->json([
            'message' => 'Pembayaran berhasil diperbarui',
            'data' => $payment->load(['resident', 'house'])
        ]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'message' => 'Pembayaran berhasil dihapus'
        ]);
    }

  public function generateMonthlyBills(Request $request)
{
    $validated = $request->validate([
        'month' => 'nullable|integer|between:1,12',
        'year' => 'nullable|integer|min:2024',
    ]);

    $now = Carbon::now();
    $month = $validated['month'] ?? $now->month;
    $year = $validated['year'] ?? $now->year;

    $securityFee = 100000;
    $cleaningFee = 15000;

    $histories = ResidentHistory::with(['resident', 'house'])
        ->whereDate('start_date', '<=', Carbon::create($year, $month, 1)->endOfMonth())
        ->where(function ($query) use ($year, $month) {
            $query->whereNull('end_date')
                ->orWhereDate('end_date', '>=', Carbon::create($year, $month, 1)->startOfMonth());
        })
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
            ->where('house_id', $history->house_id)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        if ($paymentExists) {
            continue;
        }

        Payment::create([
            'resident_id' => $history->resident_id,
            'house_id' => $history->house_id,
            'month' => $month,
            'year' => $year,
            'period_type' => 'monthly',
            'period_start_month' => $month,
            'period_end_month' => $month,
            'security_fee' => $securityFee,
            'cleaning_fee' => $cleaningFee,
            'total' => $securityFee + $cleaningFee,
            'status' => 'unpaid',
            'paid_at' => null,
            'notes' => 'Tagihan otomatis bulanan',
        ]);

        $created++;
    }

    return response()->json([
        'message' => 'Tagihan bulanan berhasil dibuat',
        'month' => $month,
        'year' => $year,
        'created' => $created,
    ]);
}

    private function preparePaymentData(array $data): array
    {
        $data['house_id'] = $data['house_id'] ?? $this->findActiveHouseId(
            (int) $data['resident_id'],
            (int) $data['month'],
            (int) $data['year']
        );

        $data['period_start_month'] = (int) $data['period_start_month'];
        $data['period_end_month'] = (int) $data['period_end_month'];
        $data['security_fee'] = (float) $data['security_fee'];
        $data['cleaning_fee'] = (float) $data['cleaning_fee'];
        $data['total'] = $data['security_fee'] + $data['cleaning_fee'];
        $data['paid_at'] = $data['status'] === 'paid'
            ? ($data['paid_at'] ?? Carbon::now()->toDateString())
            : null;

        return $data;
    }

    private function findActiveHouseId(int $residentId, int $month, int $year): ?int
    {
        $periodDate = Carbon::create($year, $month, 1);

        return ResidentHistory::where('resident_id', $residentId)
            ->whereDate('start_date', '<=', $periodDate->copy()->endOfMonth())
            ->where(function ($query) use ($periodDate) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $periodDate->copy()->startOfMonth());
            })
            ->latest('start_date')
            ->value('house_id');
    }
}
