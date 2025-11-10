<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_id',
        'rating',
        'comment',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    /**
     * Get the booking that was reviewed.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the user who wrote the review (accessor).
     */
    protected function user(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->booking?->user,
        );
    }

    /**
     * Get the yacht that was reviewed (accessor).
     */
    protected function yacht(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->booking?->yacht,
        );
    }

    /**
     * Get the owner who is being reviewed (accessor).
     */
    protected function owner(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->booking?->yacht?->owner,
        );
    }
}
