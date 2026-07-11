<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => 'required|exists:residents,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2024',
            'security_fee' => 'required|numeric|min:0',
            'cleaning_fee' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:paid,unpaid',
            'paid_at' => 'nullable|date',
        ];
    }
}