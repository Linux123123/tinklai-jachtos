<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReview extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Review $review
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
        $url = route('yachts.show', $this->review->yacht_id);

        $stars = str_repeat('⭐', $this->review->rating);

        return (new MailMessage())
            ->subject('Naujas atsiliepimas - ' . $this->review->yacht->title)
            ->greeting('Sveiki, ' . $notifiable->name . '!')
            ->line('Gavote naują atsiliepimą apie savo jachtą.')
            ->line('**Jachta:** ' . $this->review->yacht->title)
            ->line('**Vertintojas:** ' . $this->review->user->name)
            ->line('**Įvertinimas:** ' . $stars . ' (' . $this->review->rating . '/5)')
            ->line('**Komentaras:** ' . ($this->review->comment ?: 'Komentaras nepateiktas.'))
            ->action('Peržiūrėti atsiliepimą', $url)
            ->line('Dėkojame už puikų aptarnavimą!');
    }
}
