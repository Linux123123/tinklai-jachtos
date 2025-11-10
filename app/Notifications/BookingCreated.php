<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCreated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Booking $booking
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
        $url = route('owner.bookings.show', $this->booking);

        return (new MailMessage())
            ->subject('Nauja rezervacijos užklausa - ' . $this->booking->yacht->title)
            ->greeting('Sveiki, ' . $notifiable->name . '!')
            ->line('Gavote naują rezervacijos užklausą savo jachtai.')
            ->line('**Jachta:** ' . $this->booking->yacht->title)
            ->line('**Svečias:** ' . $this->booking->user->name)
            ->line('**Atvykimas:** ' . $this->booking->start_date->format('M d, Y'))
            ->line('**Išvykimas:** ' . $this->booking->end_date->format('M d, Y'))
            ->line('**Visa kaina:** $' . number_format($this->booking->total_price, 2))
            ->action('Peržiūrėti rezervaciją', $url)
            ->line('Prašome peržiūrėti ir atsakyti į šią rezervacijos užklausą kuo greičiau.');
    }
}
