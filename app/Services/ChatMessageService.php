<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class ChatMessageService
{
    /** @param array{message?: string|null} $data */
    public function store(User $user, Conversation $conversation, array $data, ?UploadedFile $media): Message
    {
        $storedMedia = $media?->store("messages/{$conversation->id}", 'public');

        if ($storedMedia === false) {
            throw ValidationException::withMessages(['media' => 'Media gagal disimpan.']);
        }

        try {
            return DB::transaction(function () use ($user, $conversation, $data, $media, $storedMedia): Message {
                $conversation = Conversation::query()
                    ->where(fn ($query) => $query
                        ->where('business_one_id', $user->business_id)
                        ->orWhere('business_two_id', $user->business_id))
                    ->lockForUpdate()
                    ->findOrFail($conversation->id);

                $message = $conversation->messages()->create([
                    'sender_business_id' => $user->business_id,
                    'sender_user_id' => $user->id,
                    'message' => ($data['message'] ?? '') === '' ? null : $data['message'],
                    'media' => $storedMedia,
                    'media_type' => $media === null
                        ? null
                        : (str_starts_with((string) $media->getMimeType(), 'image/') ? 'image' : 'video'),
                ]);

                $conversation->update(['last_message_at' => $message->created_at]);

                return $message;
            });
        } catch (Throwable $exception) {
            if (is_string($storedMedia)) {
                Storage::disk('public')->delete($storedMedia);
            }

            throw $exception;
        }
    }
}
