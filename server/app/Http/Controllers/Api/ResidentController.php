<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use App\Models\Resident;
use Illuminate\Support\Facades\Storage;
class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Resident::latest()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(StoreResidentRequest $request)
{
    $data = $request->validated();

    $data['is_married'] = (bool) $data['is_married'];

    if ($request->hasFile('ktp_photo')) {
        $data['ktp_photo'] = $request
            ->file('ktp_photo')
            ->store('ktp', 'public');
    }

    $resident = Resident::create($data);

    return response()->json([
        'message' => 'Resident created successfully',
        'data' => $resident,
    ], 201);
}
    /**
     * Display the specified resource.
     */
    public function show(Resident $resident)
    {
        return response()->json($resident);
    }

    /**
     * Update the specified resource in storage.
     */
  public function update(UpdateResidentRequest $request, Resident $resident)
{
    $data = $request->validated();

    if ($request->hasFile('ktp_photo')) {

        if ($resident->ktp_photo) {
            Storage::disk('public')->delete($resident->ktp_photo);
        }

        $data['ktp_photo'] = $request
            ->file('ktp_photo')
            ->store('ktp', 'public');
    }

    $resident->update($data);

    return response()->json([
        'message' => 'Resident updated successfully',
        'data' => $resident,
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resident $resident)
    {
        $resident->delete();

        return response()->json([
            'message' => 'Resident deleted successfully'
        ]);
    }
}