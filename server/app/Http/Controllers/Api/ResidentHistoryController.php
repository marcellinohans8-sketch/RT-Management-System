<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentHistoryRequest;
use App\Http\Requests\UpdateResidentHistoryRequest;
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
        $history = ResidentHistory::create($request->validated());

        return response()->json([
            'message' => 'Resident history created successfully',
            'data' => $history
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
        $residentHistory->update($request->validated());

        return response()->json([
            'message' => 'Resident history updated successfully',
            'data' => $residentHistory
        ]);
    }

    public function destroy(ResidentHistory $residentHistory)
    {
        $residentHistory->delete();

        return response()->json([
            'message' => 'Resident history deleted successfully'
        ]);
    }
}