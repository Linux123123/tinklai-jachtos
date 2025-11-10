<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use TwoFactorAuthenticatable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the yachts owned by the user.
     */
    public function yachts(): HasMany
    {
        return $this->hasMany(Yacht::class);
    }

    /**
     * Get the bookings made by the user.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the reviews written by the user (via their bookings).
     */
    public function reviews(): HasManyThrough
    {
        return $this->hasManyThrough(
            Review::class,
            Booking::class,
            'user_id', // Foreign key on bookings table
            'booking_id', // Foreign key on reviews table
            'id', // Local key on users table
            'id' // Local key on bookings table
        );
    }

    /**
     * Get the reviews received by the user as owner (via their yachts' bookings).
     * Note: This uses a custom query since we need Yacht -> Booking -> Review path.
     */
    public function receivedReviews()
    {
        return Review::whereHas('booking.yacht', function ($query) {
            $query->where('user_id', $this->id);
        });
    }

    /**
     * Get conversations where user is participant one.
     */
    public function conversationsAsParticipantOne(): HasMany
    {
        return $this->hasMany(Conversation::class, 'participant_one_id');
    }

    /**
     * Get conversations where user is participant two.
     */
    public function conversationsAsParticipantTwo(): HasMany
    {
        return $this->hasMany(Conversation::class, 'participant_two_id');
    }

    /**
     * Get messages sent by the user.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
