<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

  public function rules(): array
{
    return [
        'full_name' => 'required|string|max:255',
        'ktp_number' => 'required|string|unique:residents,ktp_number',
        'resident_status' => 'required|in:permanent,contract',
        'phone_number' => 'required|string|max:20',
      'is_married' => 'required|in:0,1',
        'ktp_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ];
}
}