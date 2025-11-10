<?php

namespace App\Http\Requests;

use App\Enums\Permission;
use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo(Permission::CREATE_BOOKING->value) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'yacht_id' => ['required', 'integer', 'exists:yachts,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Check if dates conflict with existing bookings
            if ($this->has('yacht_id') && $this->has('start_date') && $this->has('end_date')) {
                $hasConflict = Booking::where('yacht_id', $this->yacht_id)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->where(function ($query) {
                        $query->whereBetween('start_date', [$this->start_date, $this->end_date])
                            ->orWhereBetween('end_date', [$this->start_date, $this->end_date])
                            ->orWhere(function ($q) {
                                $q->where('start_date', '<=', $this->start_date)
                                    ->where('end_date', '>=', $this->end_date);
                            });
                    })
                    ->exists();

                if ($hasConflict) {
                    $validator->errors()->add(
                        'start_date',
                        'Pasirinktos datos sutampa su kita rezervacija.'
                    );
                }
            }

            // Validate minimum booking duration (at least 1 week)
            if ($this->has('start_date') && $this->has('end_date')) {
                $start = \Carbon\Carbon::parse($this->start_date);
                $end = \Carbon\Carbon::parse($this->end_date);
                $days = $start->diffInDays($end);

                if ($days < 7) {
                    $validator->errors()->add(
                        'end_date',
                        'Minimali rezervacijos trukmė yra 1 savaitė (7 dienos).'
                    );
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
            'yacht_id.required' => 'Prašome pasirinkti jachtą rezervacijai.',
            'yacht_id.exists' => 'Pasirinkta jachta neegzistuoja.',
            'start_date.after_or_equal' => 'Pradžios data turi būti šiandien arba vėliau.',
            'end_date.after' => 'Pabaigos data turi būti po pradžios datos.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Add authenticated user's ID
        $this->merge([
            'user_id' => $this->user()->id,
            'status' => 'pending', // All new bookings start as pending
        ]);
    }
}
