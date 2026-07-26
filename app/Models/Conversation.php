<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['business_one_id', 'business_two_id', 'last_message_at'])]
class Conversation extends Model
{
    use SoftDeletes;

    /** @return BelongsTo<Business, $this> */
    public function businessOne(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'business_one_id');
    }

    /** @return BelongsTo<Business, $this> */
    public function businessTwo(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'business_two_id');
    }

    /** @return HasMany<Message, $this> */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }
}
