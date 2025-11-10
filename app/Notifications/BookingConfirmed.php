<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification implements ShouldQueue
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
        $url = route('my-bookings.show', $this->booking);

        return (new MailMessage())
            ->subject('Rezervacija patvirtinta - ' . $this->booking->yacht->title)
            ->greeting('Puikios naujienos, ' . $notifiable->name . '!')
            ->line('Jūsų rezervaciją patvirtino jachtos savininkas.')
            ->line('**Jachta:** ' . $this->booking->yacht->title)
            ->line('**Savininkas:** ' . $this->booking->yacht->owner->name)
            ->line('**Atvykimas:** ' . $this->booking->start_date)
            ->line('**Išvykimas:** ' . $this->booking->end_date)
            ->line('**Visa kaina:** $' . $this->booking->total_price)
            ->action('Peržiūrėti rezervacijos detales', $url)
            ->line('Linkime nuostabios patirties!');
    }
}
