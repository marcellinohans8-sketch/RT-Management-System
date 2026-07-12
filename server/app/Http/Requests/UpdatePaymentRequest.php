<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => 'required|exists:residents,id',
            'house_id' => 'nullable|exists:houses,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
            'period_type' => 'required|in:monthly,annual',
            'period_start_month' => 'required|integer|between:1,12',
            'period_end_month' => 'required|integer|between:1,12|gte:period_start_month',
            'security_fee' => 'required|numeric|min:0',
            'cleaning_fee' => 'required|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
            'status' => 'required|in:paid,unpaid',
            'paid_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
