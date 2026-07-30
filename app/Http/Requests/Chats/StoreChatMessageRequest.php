<?php

namespace App\Http\Requests\Chats;

use App\Models\Conversation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $conversation = $this->route('conversation');
        $businessId = $this->user()?->business_id;

        return $conversation instanceof Conversation
            && $businessId !== null
            && in_array($businessId, [$conversation->business_one_id, $conversation->business_two_id], true);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'message' => ['nullable', 'required_without:media', 'string', 'max:5000'],
            'media' => [
                'nullable',
                'file',
                'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime',
                'max:25600',
            ],
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            $media = $this->file('media');

            if ($media?->getMimeType() !== null
                && str_starts_with($media->getMimeType(), 'image/')
                && $media->getSize() > 5 * 1024 * 1024) {
                $validator->errors()->add('media', 'Ukuran foto maksimal 5 MB.');
            }
        }];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('message')) {
            $this->merge(['message' => trim((string) $this->input('message'))]);
        }
    }
}
