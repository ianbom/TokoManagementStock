<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $business_one_id
 * @property int $business_two_id
 * @property Carbon|null $last_message_at
 * @property int $unread_count
 * @property-read Business $businessOne
 * @property-read Business $businessTwo
 * @property-read Collection<int, Message> $messages
 */
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
