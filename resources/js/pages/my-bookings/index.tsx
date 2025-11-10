import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Booking } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { format, isPast, parseISO } from 'date-fns';
import { Anchor, Calendar, Eye, MapPin, XCircle } from 'lucide-react';

interface MyBookingsIndexProps {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const BookingStatus: Record<any, any> = {
    'pending': 'Laukiama patvirtinimo',
    'confirmed': 'Patvirtinta',
    'cancelled': 'Atšaukta',
    'completed': 'Užbaigta',
}
  

export default function MyBookingsIndex({ bookings }: MyBookingsIndexProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            case 'completed':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const canCancelBooking = (booking: Booking) => {
        return ['pending', 'confirmed'].includes(booking.status) && !isPast(parseISO(booking.startDate));
    };

    const handleViewBooking = (bookingId: number) => {
        router.visit(`/my-bookings/${bookingId}`);
    };

    const handleCancelBooking = (bookingId: number, yachtTitle: string) => {
        if (confirm(`Ar tikrai norite atšaukti savo rezervaciją "${yachtTitle}"? Šio veiksmo negalima atšaukti.`)) {
            router.post(
                `/my-bookings/${bookingId}/cancel`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Mano rezervacijos" />

            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Mano rezervacijos</h1>
                    <p className="text-muted-foreground mt-2">Peržiūrėkite ir valdykite visas savo jachtų rezervacijas</p>
                </div>

                {bookings.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-semibold">Kol kas nėra rezervacijų</h3>
                                <p className="text-muted-foreground mb-6">Pradėkite naršyti jachtas ir atlikite pirmąją rezervaciją!</p>
                                <Button onClick={() => router.visit('/yachts')}>Naršyti jachtas</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking: Booking) => (
                            <Card key={booking.id} className="transition-shadow hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                        {/* Yacht Image & Info */}
                                        <div className="md:col-span-2">
                                            <div className="flex gap-4">
                                                {booking.yacht?.primaryImage?.url ? (
                                                    <img
                                                        src={booking.yacht.primaryImage.url}
                                                        alt={booking.yacht.title}
                                                        className="h-24 w-24 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-lg">
                                                        <Anchor className="text-muted-foreground h-8 w-8" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold">{booking.yacht?.title}</h3>
                                                    <div className="text-muted-foreground mt-2 flex flex-col gap-1 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>{booking.yacht?.location}</span>
                                                        </div>
                                                        {booking.yacht?.owner && <p>Savininkas: {booking.yacht.owner.name}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Datos</p>
                                                    <p className="font-medium">{format(parseISO(booking.startDate), 'MMM dd, yyyy')}</p>
                                                    <p className="text-muted-foreground text-xs">iki</p>
                                                    <p className="font-medium">{format(parseISO(booking.endDate), 'MMM dd, yyyy')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Visa kaina</p>
                                                    <p className="text-lg font-semibold">${Number(booking.totalPrice).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-end justify-between">
                                            <Badge variant={getStatusVariant(booking.status)}>{BookingStatus[booking.status] ?? "Nežinomas statusas"}</Badge>
                                            <div className="mt-4 flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking.id)}>
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Peržiūrėti
                                                </Button>
                                                {canCancelBooking(booking) && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelBooking(booking.id, booking.yacht?.title || 'šią jachtą')}
                                                    >
                                                        <XCircle className="mr-1 h-4 w-4" />
                                                        Atšaukti
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Pagination currentPage={bookings.current_page} lastPage={bookings.last_page} links={bookings.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
