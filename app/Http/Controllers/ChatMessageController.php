<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chats\StoreChatMessageRequest;
use App\Models\Conversation;
use App\Services\ChatMessageService;
use Illuminate\Http\RedirectResponse;

class ChatMessageController extends Controller
{
    public function __construct(private readonly ChatMessageService $chatMessageService) {}

    public function store(StoreChatMessageRequest $request, Conversation $conversation): RedirectResponse
    {
        $this->chatMessageService->store(
            $request->user(),
            $conversation,
            $request->safe()->only('message'),
            $request->file('media'),
        );

        return to_route('chats.show', $conversation);
    }
}
