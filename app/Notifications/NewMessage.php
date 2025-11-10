<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMessage extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Message $message
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('messages.show', $this->message->conversation_id);

        return (new MailMessage())
            ->subject('Nauja žinutė nuo ' . $this->message->sender->name)
            ->greeting('Sveiki, ' . $notifiable->name . '!')
            ->line('Gavote naują žinutę.')
            ->line('**Nuo:** ' . $this->message->sender->name)
            ->line('**Žinutė:** ' . substr($this->message->body, 0, 100) . (strlen($this->message->body) > 100 ? '...' : ''))
            ->action('Skaityti žinutę', $url)
            ->action('Peržiūrėti žinutę', $url);
    }
}
