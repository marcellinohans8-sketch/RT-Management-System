<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            House::with([
                'residentHistories' => function ($query) {
                    $query->whereNull('end_date')
                          ->with('resident');
                }
            ])
            ->latest()
            ->get()
        );
    }

    /**
     * Store a newly created resource.
     */
    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());

        return response()->json([
            'message' => 'House created successfully',
            'data' => $house
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(House $house)
    {
        return response()->json(
            $house->load([
                'residentHistories' => function ($query) {
                    $query->whereNull('end_date')
                          ->with('resident');
                }
            ])
        );
    }

    /**
     * Update the specified resource.
     */
    public function update(UpdateHouseRequest $request, House $house)
    {
        $house->update($request->validated());

        return response()->json([
            'message' => 'House updated successfully',
            'data' => $house
        ]);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(House $house)
    {
        $house->delete();

        return response()->json([
            'message' => 'House deleted successfully'
        ]);
    }
}