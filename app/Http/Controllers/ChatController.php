<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate(['search' => ['nullable', 'string', 'max:100']]);
        $businessId = $request->user()->business_id;
        $search = trim((string) ($validated['search'] ?? ''));

        $conversations = Conversation::query()
            ->select(['id', 'business_one_id', 'business_two_id', 'last_message_at'])
            ->when(
                $businessId,
                fn (Builder $query) => $query->where(fn (Builder $query) => $query
                    ->where('business_one_id', $businessId)
                    ->orWhere('business_two_id', $businessId)),
                fn (Builder $query) => $query->whereRaw('1 = 0'),
            )
            ->when($search !== '' && $businessId, fn (Builder $query) => $this->applySearch($query, $businessId, $search))
            ->with([
                'businessOne:id,name,business_category,address',
                'businessTwo:id,name,business_category,address',
                'messages' => fn ($query) => $query
                    ->select(['id', 'conversation_id', 'message', 'media_type', 'created_at'])
                    ->latest('id')
                    ->limit(1),
            ])
            ->withCount(['messages as unread_count' => fn (Builder $query) => $query
                ->where('sender_business_id', '!=', $businessId)
                ->whereNull('read_at')])
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Conversation $conversation) => $this->conversationData($conversation, (int) $businessId));

        return Inertia::render('chats/list-chat', [
            'conversations' => $conversations,
            'filters' => ['search' => $search],
        ]);
    }

    public function show(Request $request, Conversation $conversation): Response
    {
        $businessId = $request->user()->business_id;
        abort_unless($businessId && in_array($businessId, [$conversation->business_one_id, $conversation->business_two_id], true), 404);

        Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('sender_business_id', '!=', $businessId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $conversation->load([
            'businessOne:id,name,business_category,address',
            'businessTwo:id,name,business_category,address',
            'messages' => fn ($query) => $query
                ->select(['id', 'conversation_id', 'sender_business_id', 'message', 'media', 'media_type', 'read_at', 'created_at'])
                ->orderBy('created_at')
                ->orderBy('id'),
        ]);

        $partner = $this->partner($conversation, $businessId);

        return Inertia::render('chats/chat', [
            'conversation' => ['id' => $conversation->id],
            'partner' => $this->partnerData($partner),
            'messages' => $conversation->messages->map(fn (Message $message) => [
                'id' => $message->id,
                'message' => $message->message,
                'media_type' => $message->media_type,
                'media_url' => $message->media === null ? null : Storage::disk('public')->url($message->media),
                'sent_by_me' => $message->sender_business_id === $businessId,
                'read_at' => $message->read_at?->toIso8601String(),
                'created_at' => $message->created_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    public function partners(Request $request): JsonResponse
    {
        $businessId = $request->user()->business_id;
        abort_if($businessId === null, 403);

        $validated = $request->validate([
            'search' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $partners = Business::query()
            ->whereKeyNot($businessId)
            ->where('name', 'like', '%'.trim($validated['search']).'%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'business_category', 'address'])
            ->map(fn (Business $business) => $this->partnerData($business));

        return response()->json(['partners' => $partners]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        $businessId = $request->user()->business_id;
        abort_if($businessId === null, 403);
        abort_if($business->id === $businessId, 403);

        [$businessOneId, $businessTwoId] = collect([$businessId, $business->id])
            ->sort()
            ->values()
            ->all();

        $conversation = Conversation::withTrashed()->createOrFirst([
            'business_one_id' => $businessOneId,
            'business_two_id' => $businessTwoId,
        ]);

        if ($conversation->trashed()) {
            $conversation->restore();
        }

        return to_route('chats.show', $conversation);
    }

    /** @param Builder<Conversation> $query */
    private function applySearch(Builder $query, int $businessId, string $search): void
    {
        $query->where(function (Builder $query) use ($businessId, $search) {
            $query
                ->where(fn (Builder $query) => $query
                    ->where('business_one_id', $businessId)
                    ->whereHas('businessTwo', fn (Builder $query) => $query->where('name', 'like', "%{$search}%")))
                ->orWhere(fn (Builder $query) => $query
                    ->where('business_two_id', $businessId)
                    ->whereHas('businessOne', fn (Builder $query) => $query->where('name', 'like', "%{$search}%")))
                ->orWhereHas('messages', fn (Builder $query) => $query->where('message', 'like', "%{$search}%"));
        });
    }

    /** @return array<string, mixed> */
    private function conversationData(Conversation $conversation, int $businessId): array
    {
        $latestMessage = $conversation->messages->first();
        $latestMessageText = 'Belum ada pesan';
        $latestMessageAt = $conversation->last_message_at?->toIso8601String();

        if ($conversation->messages->isNotEmpty()) {
            $latestMessageText = $latestMessage->message
                ?? ($latestMessage->media_type === 'image' ? 'Mengirim foto' : 'Mengirim video');
            $latestMessageAt = $latestMessage->created_at?->toIso8601String();
        }

        return [
            'id' => $conversation->id,
            'partner' => $this->partnerData($this->partner($conversation, $businessId)),
            'latest_message' => $latestMessageText,
            'latest_message_at' => $latestMessageAt,
            'unread_count' => (int) $conversation->unread_count,
        ];
    }

    private function partner(Conversation $conversation, int $businessId): Business
    {
        return $conversation->business_one_id === $businessId
            ? $conversation->businessTwo
            : $conversation->businessOne;
    }

    /** @return array<string, mixed> */
    private function partnerData(Business $partner): array
    {
        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'category' => $partner->business_category ?: 'Mitra Usaha',
            'address' => $partner->address,
        ];
    }
}
