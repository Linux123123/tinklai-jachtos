import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { Booking } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Anchor, Calendar, DollarSign, Mail, MapPin, User } from 'lucide-react';

interface OwnerBookingShowProps {
    booking: Booking;
}

export default function OwnerBookingShow({ booking }: OwnerBookingShowProps) {
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

    const handleConfirm = () => {
        if (confirm('Ar tikrai norite patvirtinti šią rezervaciją?')) {
            router.post(
                `/owner/bookings/${booking.id}/confirm`,
                {},
                {
                    onSuccess: () => {
                        alert('Rezervacija sėkmingai patvirtinta!');
                    },
                },
            );
        }
    };

    const handleReject = () => {
        if (confirm('Ar tikrai norite atmesti šią rezervaciją?')) {
            router.post(
                `/owner/bookings/${booking.id}/reject`,
                {},
                {
                    onSuccess: () => {
                        alert('Rezervacija sėkmingai atmesta!');
                    },
                },
            );
        }
    };

    const handleComplete = () => {
        if (confirm('Ar tikrai norite pažymėti šią rezervaciją kaip užbaigtą?')) {
            router.post(
                `/owner/bookings/${booking.id}/complete`,
                {},
                {
                    onSuccess: () => {
                        alert('Rezervacija pažymėta kaip užbaigta!');
                    },
                },
            );
        }
    };

    return (
        <AppLayout>
            <Head title={`Booking #${booking.id}`} />

            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/owner/bookings">← Atgal į rezervacijas</Link>
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Rezervacija #{booking.id}</h1>
                            <p className="text-muted-foreground mt-1">Rezervacijos detalės ir nuomininko informacija</p>
                        </div>
                        <Badge variant={getStatusVariant(booking.status)} className="px-4 py-2 text-lg">
                            {booking.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Yacht Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Anchor className="h-5 w-5" />
                                Jachtos informacija
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {booking.yacht?.primaryImage && (
                                <img src={booking.yacht.primaryImage.url} alt={booking.yacht.title} className="h-48 w-full rounded-lg object-cover" />
                            )}

                            <div>
                                <h3 className="text-lg font-semibold">{booking.yacht?.title}</h3>
                                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4" />
                                    {booking.yacht?.location}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Tipas:</span>
                                    <span className="text-sm font-medium">{booking.yacht?.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">Talpa:</span>
                                    <span className="text-sm font-medium">{booking.yacht?.capacity} svečiai</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Renter Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Nuomininko informacija
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{booking.user?.name}</h3>
                                <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4" />
                                    {booking.user?.email}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <p className="text-muted-foreground text-sm">
                                    Narys nuo {booking.user?.createdAt && format(new Date(booking.user.createdAt), 'MMMM yyyy')}
                                </p>
                            </div>

                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/messages?user_id=${booking.user?.id}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Susisiekti su nuomininku
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Booking Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Rezervacijos detalės
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <h4 className="mb-2 font-semibold">Atvykimas</h4>
                                    <p className="text-2xl font-bold">{format(new Date(booking.startDate), 'd')}</p>
                                    <p className="text-muted-foreground text-sm">{format(new Date(booking.startDate), 'MMMM yyyy')}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Išvykimas</h4>
                                    <p className="text-2xl font-bold">{format(new Date(booking.endDate), 'd')}</p>
                                    <p className="text-muted-foreground text-sm">{format(new Date(booking.endDate), 'MMMM yyyy')}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Trukmė</h4>
                                    <p className="text-2xl font-bold">
                                        {booking.durationDays ||
                                            Math.ceil(
                                                (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24),
                                            )}
                                    </p>
                                    <p className="text-muted-foreground text-sm">dienos</p>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="text-muted-foreground h-5 w-5" />
                                    <span className="text-lg font-semibold">Bendra suma</span>
                                </div>
                                <span className="text-2xl font-bold">${parseFloat(booking.totalPrice).toLocaleString()}</span>
                            </div>

                            {booking.status === 'pending' && (
                                <>
                                    <Separator className="my-6" />
                                    <div className="flex gap-3">
                                        <Button onClick={handleConfirm} className="flex-1">
                                            Patvirtinti rezervaciją
                                        </Button>
                                        <Button onClick={handleReject} variant="destructive" className="flex-1">
                                            Atmesti rezervaciją
                                        </Button>
                                    </div>
                                </>
                            )}

                            {booking.status === 'confirmed' && (
                                <>
                                    <Separator className="my-6" />
                                    <Button onClick={handleComplete} className="w-full">
                                        Žymėti kaip užbaigtą
                                    </Button>
                                </>
                            )}

                            {booking.status === 'completed' && (
                                <>
                                    <Separator className="my-6" />
                                    <div className="text-muted-foreground text-center text-sm">Ši rezervacija yra užbaigta.</div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
