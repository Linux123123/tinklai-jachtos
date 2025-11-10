<?php

namespace App\Http\Requests;

use App\Enums\Permission;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo(Permission::CREATE_REVIEW->value) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Get booking from route parameter
            $booking = $this->route('booking');

            if ($booking) {
                // Check if user owns this booking
                if ($booking->user_id !== $this->user()->id) {
                    $validator->errors()->add('rating', 'Galite vertinti tik savo rezervacijas.');

                    return;
                }

                // Check if booking is completed
                if ($booking->status !== 'completed') {
                    $validator->errors()->add('rating', 'Galite vertinti tik užbaigtas rezervacijas.');

                    return;
                }

                // Check if review already exists for this booking
                if (Review::where('booking_id', $booking->id)->exists()) {
                    $validator->errors()->add('rating', 'Jau esate palikę atsiliepimą apie šią rezervaciją.');

                    return;
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'Prašome pateikti įvertinimą.',
            'rating.min' => 'Įvertinimas turi būti bent 1 žvaigždutė.',
            'rating.max' => 'Įvertinimas negali viršyti 5 žvaigždučių.',
            'comment.max' => 'Komentaras negali viršyti 2000 simbolių.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Not needed anymore since booking comes from route parameter
    }
}
