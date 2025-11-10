<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateYachtRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $yacht = $this->route('yacht');

        return $yacht && $this->user()?->can('update', $yacht);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'type' => ['sometimes', 'string', Rule::in(['sailboat', 'motorboat', 'catamaran', 'yacht'])],
            'capacity' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'location' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'string', Rule::in(['available', 'unavailable', 'maintenance'])],
            'images' => ['sometimes', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB max per image
            'primary_image_index' => ['sometimes', 'integer', 'min:0'],
            'delete_images' => ['sometimes', 'array'],
            'delete_images.*' => ['integer', 'exists:yacht_images,id'],
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
            'delete_images.*' => 'image to delete',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'type.in' => 'The selected yacht type is invalid. Please choose from: sailboat, motorboat, catamaran, or yacht.',
            'capacity.max' => 'The capacity cannot exceed 100 people.',
            'images.max' => 'You can upload a maximum of 10 images.',
            'images.*.max' => 'Each image must not exceed 5MB.',
            'delete_images.*.exists' => 'One or more images to delete do not exist.',
        ];
    }
}
