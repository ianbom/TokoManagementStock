<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['conversation_id', 'sender_business_id', 'sender_user_id', 'message', 'read_at'])]
class Message extends Model
{
    use SoftDeletes;

    /** @return BelongsTo<Conversation, $this> */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /** @return BelongsTo<Business, $this> */
    public function senderBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'sender_business_id');
    }

    /** @return BelongsTo<User, $this> */
    public function senderUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
