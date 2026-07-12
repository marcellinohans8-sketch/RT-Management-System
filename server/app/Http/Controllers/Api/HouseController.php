<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;

class HouseController extends Controller
{
    public function index()
    {
        return response()->json(
            House::with([
                'residentHistories' => function ($query) {
                    $query->with('resident')
                        ->latest('start_date');
                },
                'payments' => function ($query) {
                    $query->with('resident')
                        ->latest();
                },
            ])
            ->withCount([
                'residentHistories as active_residents_count' => function ($query) {
                    $query->whereNull('end_date');
                },
            ])
            ->latest()
            ->get()
        );
    }

    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());

        return response()->json([
            'message' => 'Rumah berhasil ditambahkan',
            'data' => $house,
        ], 201);
    }

    public function show(House $house)
    {
        return response()->json(
            $house->load([
                'residentHistories' => function ($query) {
                    $query->with('resident')
                        ->latest('start_date');
                },
                'payments' => function ($query) {
                    $query->with('resident')
                        ->latest();
                },
            ])
            ->loadCount([
                'residentHistories as active_residents_count' => function ($query) {
                    $query->whereNull('end_date');
                },
            ])
        );
    }

    public function update(UpdateHouseRequest $request, House $house)
    {
        $house->update($request->validated());

        return response()->json([
            'message' => 'Rumah berhasil diperbarui',
            'data' => $house,
        ]);
    }

    public function destroy(House $house)
    {
        $house->delete();

        return response()->json([
            'message' => 'Rumah berhasil dihapus',
        ]);
    }
}
