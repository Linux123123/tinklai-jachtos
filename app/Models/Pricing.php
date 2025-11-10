<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pricing extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'yacht_id',
        'start_date',
        'end_date',
        'price_per_week',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'price_per_week' => 'decimal:2',
        ];
    }

    /**
     * Get the yacht that owns the pricing.
     */
    public function yacht(): BelongsTo
    {
        return $this->belongsTo(Yacht::class);
    }
}
