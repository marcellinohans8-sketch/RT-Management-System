<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $residentId = $this->route('resident')->id;

        return [
            'full_name' => 'required|string|max:255',
            'ktp_number' => 'required|string|max:20|unique:residents,ktp_number,' . $residentId,
'resident_status' => 'required|in:permanent,contract',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'required|boolean',
        ];
    }
}