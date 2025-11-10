<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Yacht extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'capacity',
        'location',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
        ];
    }

    /**
     * Get the owner of the yacht.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the images for the yacht.
     */
    public function images(): HasMany
    {
        return $this->hasMany(YachtImage::class);
    }

    /**
     * Get the primary image for the yacht.
     */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(YachtImage::class)->where('is_primary', true);
    }

    /**
     * Get the pricings for the yacht.
     */
    public function pricings(): HasMany
    {
        return $this->hasMany(Pricing::class);
    }

    /**
     * Get the bookings for the yacht.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the reviews for the yacht (via bookings).
     */
    public function reviews(): HasManyThrough
    {
        return $this->hasManyThrough(
            Review::class,
            Booking::class,
            'yacht_id', // Foreign key on bookings table
            'booking_id', // Foreign key on reviews table
            'id', // Local key on yachts table
            'id' // Local key on bookings table
        );
    }
}
