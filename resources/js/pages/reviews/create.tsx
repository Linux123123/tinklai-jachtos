import { StarRating } from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Booking } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface ReviewsCreateProps {
    booking: Booking;
}

export default function ReviewsCreate({ booking }: ReviewsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        rating: 0,
        comment: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/bookings/${booking.id}/review`);
    };

    return (
        <AppLayout>
            <Head title="Palikti atsiliepimą" />

            <div className="container mx-auto max-w-2xl py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Palikti atsiliepimą</CardTitle>
                        <CardDescription>Pasidalinkite savo patirtimi apie {booking.yacht?.title}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {booking.yacht?.primaryImage && (
                            <div className="mb-6">
                                <img src={booking.yacht.primaryImage.url} alt={booking.yacht.title} className="h-48 w-full rounded-lg object-cover" />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label>Įvertinimas *</Label>
                                <div className="mt-2">
                                    <StarRating rating={data.rating} size="lg" onChange={(rating) => setData('rating', rating)} />
                                </div>
                                {errors.rating && <p className="text-destructive mt-1 text-sm">{errors.rating}</p>}
                            </div>

                            <div>
                                <Label htmlFor="comment">Komentaras</Label>
                                <Textarea
                                    id="comment"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder="Papasakokite apie savo patirtį..."
                                    rows={5}
                                    className="mt-2"
                                />
                                {errors.comment && <p className="text-destructive mt-1 text-sm">{errors.comment}</p>}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing || data.rating === 0}>
                                    Pateikti atsiliepimą
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Atšaukti
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
