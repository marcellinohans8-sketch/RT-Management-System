<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $houseId = $this->route('house')->id;

        return [
            'house_number' => 'required|string|max:20|unique:houses,house_number,' . $houseId,
            'address' => 'required|string|max:255',
            'status' => 'required|in:occupied,vacant',
            'notes' => 'nullable|string',
        ];
    }
}