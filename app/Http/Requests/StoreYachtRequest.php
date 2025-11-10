<?php

namespace App\Http\Requests;

use App\Enums\Permission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreYachtRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo(Permission::CREATE_YACHT->value) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'type' => ['required', 'string', Rule::in(['sailboat', 'motorboat', 'catamaran', 'yacht'])],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'status' => ['sometimes', 'string', Rule::in(['available', 'unavailable', 'maintenance'])],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB max per image
            'primary_image_index' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'images.*' => 'image',
            'primary_image_index' => 'primary image',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'type.in' => 'Pasirinktas jachtos tipas netinkamas. Prašome pasirinkti iš: burlaiviai, motorinės valtys, katamaranai arba jachtos.',
            'capacity.max' => 'Talpa negali viršyti 100 žmonių.',
            'images.max' => 'Galite įkelti daugiausiai 10 nuotraukų.',
            'images.*.max' => 'Kiekviena nuotrauka negali viršyti 5MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default status if not provided
        if (!$this->has('status')) {
            $this->merge([
                'status' => 'available',
            ]);
        }

        // Add authenticated user's ID
        $this->merge([
            'user_id' => $this->user()->id,
        ]);
    }
}
