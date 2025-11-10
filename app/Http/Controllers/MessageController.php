<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display a listing of user's conversations.
     */
    public function index(Request $request): Response
    {
        $userId = auth()->id();

        $conversations = Conversation::query()
            ->where(function ($query) use ($userId) {
                $query->where('participant_one_id', $userId)
                    ->orWhere('participant_two_id', $userId);
            })
            ->with([
                'participantOne',
                'participantTwo',
                'messages' => fn ($q) => $q->latest()->limit(1),
            ])
            ->latest('updated_at')
            ->paginate(20);

        // If user_id is provided, prepare to start a conversation with that user
        $recipientId = $request->input('user_id');
        $recipient = $recipientId ? User::find($recipientId) : null;

        return Inertia::render('messages/index', [
            'conversations' => ConversationResource::collection($conversations),
            'recipient' => $recipient ? [
                'id' => $recipient->id,
                'name' => $recipient->name,
                'email' => $recipient->email,
            ] : null,
        ]);
    }

    /**
     * Display a specific conversation.
     */
    public function show(Conversation $conversation): Response
    {
        Gate::authorize('view', $conversation);

        $conversation->load([
            'participantOne',
            'participantTwo',
            'messages.sender',
        ]);

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('messages/show', [
            'conversation' => ConversationResource::make($conversation),
        ]);
    }

    /**
     * Start a new conversation or return existing one.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $recipientId = $validated['recipient_id'];
        $userId = auth()->id();

        // Check if conversation already exists
        $conversation = Conversation::query()
            ->where(function ($query) use ($userId, $recipientId) {
                $query->where('participant_one_id', $userId)
                    ->where('participant_two_id', $recipientId);
            })
            ->orWhere(function ($query) use ($userId, $recipientId) {
                $query->where('participant_one_id', $recipientId)
                    ->where('participant_two_id', $userId);
            })
            ->first();

        // Create conversation if it doesn't exist
        if (!$conversation) {
            $conversation = Conversation::create([
                'participant_one_id' => min($userId, $recipientId),
                'participant_two_id' => max($userId, $recipientId),
            ]);
        }

        // Create the message
        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'body' => $validated['message'],
        ]);

        // Broadcast the message to all participants
        broadcast(new MessageSent($message->load('sender')));

        // Notify the recipient
        $recipient = User::find($recipientId);
        if ($recipient) {
            $recipient->notify(new NewMessage($message));
        }

        return redirect()->route('messages.show', $conversation);
    }

    /**
     * Store a new message in an existing conversation.
     */
    public function storeMessage(Request $request, Conversation $conversation): RedirectResponse
    {
        Gate::authorize('view', $conversation);

        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => auth()->id(),
            'body' => $validated['message'],
        ]);

        // Touch conversation to update its timestamp
        $conversation->touch();

        // Broadcast the message to all participants (frontend will prevent duplicates)
        broadcast(new MessageSent($message->load('sender')));

        // Notify the recipient
        $recipientId = $conversation->participant_one_id === auth()->id()
            ? $conversation->participant_two_id
            : $conversation->participant_one_id;
        $recipient = User::find($recipientId);
        if ($recipient) {
            $recipient->notify(new NewMessage($message));
        }

        // Return back without reloading to let Echo handle the UI update
        return back();
    }

    /**
     * Mark a message as read.
     */
    public function markAsRead(Message $message): RedirectResponse
    {
        Gate::authorize('view', $message);

        if ($message->sender_id !== auth()->id() && !$message->read_at) {
            $message->markAsRead();
        }

        return back();
    }

    /**
     * Delete a message.
     */
    public function destroy(Message $message): RedirectResponse
    {
        Gate::authorize('delete', $message);

        $message->delete();

        return back()->with('success', 'Message deleted.');
    }
}
