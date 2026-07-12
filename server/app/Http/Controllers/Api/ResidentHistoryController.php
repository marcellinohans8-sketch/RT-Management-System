<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentHistoryRequest;
use App\Http\Requests\UpdateResidentHistoryRequest;
use App\Models\House;
use App\Models\ResidentHistory;

class ResidentHistoryController extends Controller
{
    public function index()
    {
        return response()->json(
            ResidentHistory::with(['house', 'resident'])
                ->latest()
                ->get()
        );
    }

    public function store(StoreResidentHistoryRequest $request)
    {
        $data = $request->validated();

        if (empty($data['end_date'])) {
            ResidentHistory::where('house_id', $data['house_id'])
                ->whereNull('end_date')
                ->update(['end_date' => $data['start_date']]);
        }

        $history = ResidentHistory::create($data);
        $this->syncHouseStatus((int) $data['house_id']);

        return response()->json([
            'message' => 'Penghuni rumah berhasil ditambahkan',
            'data' => $history->load(['house', 'resident'])
        ], 201);
    }

    public function show(ResidentHistory $residentHistory)
    {
        return response()->json(
            $residentHistory->load(['house', 'resident'])
        );
    }

    public function update(UpdateResidentHistoryRequest $request, ResidentHistory $residentHistory)
    {
        $oldHouseId = $residentHistory->house_id;
        $data = $request->validated();

        if (empty($data['end_date'])) {
            ResidentHistory::where('house_id', $data['house_id'])
                ->whereNull('end_date')
                ->where('id', '!=', $residentHistory->id)
                ->update(['end_date' => $data['start_date']]);
        }

        $residentHistory->update($data);
        $this->syncHouseStatus((int) $oldHouseId);
        $this->syncHouseStatus((int) $data['house_id']);

        return response()->json([
            'message' => 'Penghuni rumah berhasil diperbarui',
            'data' => $residentHistory->load(['house', 'resident'])
        ]);
    }

    public function destroy(ResidentHistory $residentHistory)
    {
        $houseId = $residentHistory->house_id;
        $residentHistory->delete();
        $this->syncHouseStatus((int) $houseId);

        return response()->json([
            'message' => 'Riwayat penghuni rumah berhasil dihapus'
        ]);
    }

    private function syncHouseStatus(int $houseId): void
    {
        $hasActiveResident = ResidentHistory::where('house_id', $houseId)
            ->whereNull('end_date')
            ->exists();

        House::where('id', $houseId)->update([
            'status' => $hasActiveResident ? 'occupied' : 'vacant',
        ]);
    }
}
