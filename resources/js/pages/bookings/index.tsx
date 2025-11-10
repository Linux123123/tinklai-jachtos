import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Booking } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Anchor, Calendar, MapPin } from 'lucide-react';

interface BookingsIndexProps {
    bookings: {
        data: Booking[];
    };
}

export default function BookingsIndex({ bookings }: BookingsIndexProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-blue-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout>
            <Head title="Mano rezervacijos" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Mano rezervacijos</h1>
                    <p className="text-muted-foreground mt-1">Peržiūrėkite ir tvarkykite savo jachtų rezervacijas</p>
                </div>

                {bookings.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">Dar neturite nei vienos rezervacijos</p>
                            <Button asChild>
                                <Link href="/yachts">Naršyti jachtas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Anchor className="h-5 w-5" />
                                            {booking.yacht?.title}
                                        </CardTitle>
                                        <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="text-muted-foreground h-4 w-4" />
                                                <span>
                                                    {format(new Date(booking.startDate), 'MMM d, yyyy')} -{' '}
                                                    {format(new Date(booking.endDate), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="text-muted-foreground h-4 w-4" />
                                                <span>{booking.yacht?.location}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground text-sm">Bendra kaina:</span>
                                                <span className="font-semibold">${parseFloat(booking.totalPrice).toLocaleString()}</span>
                                            </div>
                                            {booking.status === 'pending' && (
                                                <p className="text-muted-foreground text-xs">Laukiama savininko patvirtinimo</p>
                                            )}
                                            {booking.status === 'confirmed' && <p className="text-xs text-green-600">Jūsų rezervacija patvirtinta!</p>}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/yachts/${booking.yachtId}`}>Peržiūrėti jachtą</Link>
                                        </Button>
                                        {booking.status === 'confirmed' && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/messages?yacht_id=${booking.yachtId}`}>Rašyti savininkui</Link>
                                            </Button>
                                        )}
                                        {booking.status === 'completed' && !booking.review && (
                                            <Button size="sm" asChild>
                                                <Link href={`/reviews/create?booking_id=${booking.id}`}>Palikti atsiliepimą</Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
