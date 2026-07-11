<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreResidentHistoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    return [
        'house_id' => 'required|exists:houses,id',
        'resident_id' => 'required|exists:residents,id',
        'start_date' => 'required|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
    ];
}
}