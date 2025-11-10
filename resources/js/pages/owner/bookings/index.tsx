import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Booking } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { Calendar, DollarSign, User } from 'lucide-react';

interface OwnerBookingsIndexProps {
    bookings: {
        data: Booking[];
    };
}

export default function OwnerBookingsIndex({ bookings }: OwnerBookingsIndexProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'confirmed':
                return 'default';
            case 'completed':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout>
            <Head title="Valdyti rezervacijas" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Valdyti rezervacijas</h1>
                    <p className="text-muted-foreground mt-1">Peržiūrėti ir valdyti jūsų jachtų rezervacijas</p>
                </div>

                {bookings.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="text-muted-foreground mb-4 h-16 w-16" />
                            <h3 className="mb-2 text-xl font-semibold">Kol kas rezervacijų nėra</h3>
                            <p className="text-muted-foreground mb-4">Kai kas nors rezervuos vieną iš jūsų jachtų, ji atsiras čia</p>
                            <Button asChild>
                                <Link href="/my-yachts">Peržiūrėti mano jachtas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {bookings.data.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                {booking.yacht?.title}
                                                <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-2">Rezervacija #{booking.id}</CardDescription>
                                        </div>
                                        {booking.yacht?.primaryImage && (
                                            <img
                                                src={booking.yacht.primaryImage.url}
                                                alt={booking.yacht.title}
                                                className="h-24 w-24 rounded-lg object-cover"
                                            />
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="flex items-center gap-2">
                                            <User className="text-muted-foreground h-4 w-4" />
                                            <div>
                                                <p className="text-sm font-medium">Nuomininkas</p>
                                                <p className="text-muted-foreground text-sm">{booking.user?.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-muted-foreground h-4 w-4" />
                                            <div>
                                                <p className="text-sm font-medium">Datos</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {formatDate(new Date(booking.startDate), 'MMM d')} -{' '}
                                                    {formatDate(new Date(booking.endDate), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <DollarSign className="text-muted-foreground h-4 w-4" />
                                            <div>
                                                <p className="text-sm font-medium">Iš viso</p>
                                                <p className="text-muted-foreground text-sm">${parseFloat(booking.totalPrice).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/owner/bookings/${booking.id}`}>Peržiūrėti detales</Link>
                                        </Button>

                                        {booking.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Patvirtinti šią rezervaciją?')) {
                                                            router.post(`/owner/bookings/${booking.id}/confirm`);
                                                        }
                                                    }}
                                                >
                                                    Patvirtinti
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Atmesti šią rezervaciją?')) {
                                                            router.post(`/owner/bookings/${booking.id}/reject`);
                                                        }
                                                    }}
                                                >
                                                    Atmesti
                                                </Button>
                                            </>
                                        )}

                                        {booking.status === 'confirmed' && (
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Pažymėti šią rezervaciją kaip užbaigtą?')) {
                                                        router.post(`/owner/bookings/${booking.id}/complete`);
                                                    }
                                                }}
                                            >
                                                Žymėti kaip užbaigtą
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
