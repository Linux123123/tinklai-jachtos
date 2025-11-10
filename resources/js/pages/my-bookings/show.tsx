import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Booking } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { differenceInDays, format, isPast, parseISO } from 'date-fns';
import { Anchor, Calendar, Eye, Info, MapPin, Star, User, Users, XCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface MyBookingsShowProps {
    booking: Booking;
}

const BookingStatus: Record<any, any> = {
    'pending': 'Laukiama patvirtinimo',
    'confirmed': 'Patvirtinta',
    'cancelled': 'Atšaukta',
    'completed': 'Užbaigta',
}

export default function MyBookingsShow({ booking }: MyBookingsShowProps) {
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

    const canCancelBooking = () => {
        return ['pending', 'confirmed'].includes(booking.status) && !isPast(parseISO(booking.startDate));
    };

    const handleCancelBooking = () => {
        if (confirm(`Ar tikrai norite atšaukti šią rezervaciją? Šis veiksmas negali būti atšauktas.`)) {
            router.post(
                `/my-bookings/${booking.id}/cancel`,
                {},
                {
                    onSuccess: () => {
                        // Optionally redirect back to bookings list
                    },
                },
            );
        }
    };

    const handleViewYacht = () => {
        router.visit(`/yachts/${booking.yacht?.id}`);
    };

    const days = differenceInDays(parseISO(booking.endDate), parseISO(booking.startDate));
    const weeks = Math.ceil(days / 7);

    return (
        <AppLayout>
            <Head title={`Booking #${booking.id}`} />

            <div className="container mx-auto py-6">
                <Button variant="ghost" onClick={() => router.visit('/my-bookings')} className="mb-4">
                    ← Atgal į mano rezervacijas
                </Button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Booking Status */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Rezervacija #{booking.id}</CardTitle>
                                        <CardDescription>Rezervuota {format(parseISO(booking.createdAt), 'PPP')}</CardDescription>
                                    </div>
                                    <Badge variant={getStatusVariant(booking.status)} className="px-4 py-2 text-lg">
                                        {BookingStatus[booking.status]}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Status Alert */}
                        {booking.status === 'pending' && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    Jūsų rezervacijos užklausa laukia jachtos savininko patvirtinimo. Jūs būsite informuotas, kai ji bus patvirtinta.
                                </AlertDescription>
                            </Alert>
                        )}

                        {booking.status === 'cancelled' && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>Ši rezervacija buvo atšaukta.</AlertDescription>
                            </Alert>
                        )}

                        {/* Yacht Information */}
                        {booking.yacht && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jachtos detalės</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        {booking.yacht.primaryImage?.url ? (
                                            <img
                                                src={booking.yacht.primaryImage.url}
                                                alt={booking.yacht.title}
                                                className="h-32 w-32 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="bg-muted flex h-32 w-32 items-center justify-center rounded-lg">
                                                <Anchor className="text-muted-foreground h-12 w-12" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-xl font-semibold">{booking.yacht.title}</h3>
                                                <p className="text-muted-foreground">
                                                    {booking.yacht.description?.substring(0, 150)}
                                                    {(booking.yacht.description?.length || 0) > 150 && '...'}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="text-muted-foreground h-4 w-4" />
                                                    <span>{booking.yacht.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Anchor className="text-muted-foreground h-4 w-4" />
                                                    <span className="capitalize">{booking.yacht.type}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="text-muted-foreground h-4 w-4" />
                                                    <span>{booking.yacht.capacity} svečiai</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={handleViewYacht}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Peržiūrėti jachtą
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Booking Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rezervacijos laikotarpis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground mb-1 text-sm">Atvykimas</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-muted-foreground h-4 w-4" />
                                            <p className="font-medium">{format(parseISO(booking.startDate), 'EEEE, MMMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1 text-sm">Išvykimas</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-muted-foreground h-4 w-4" />
                                            <p className="font-medium">{format(parseISO(booking.endDate), 'EEEE, MMMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Trukmė</span>
                                    <span className="font-medium">
                                        {days} dienos ({weeks} {weeks === 1 ? 'savaitė' : 'savaitės'})
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Owner Information */}
                        {booking.yacht?.owner && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Savininkas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <User className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.yacht.owner.name}</p>
                                            <p className="text-muted-foreground text-sm">{booking.yacht.owner.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Price Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Duration</span>
                                    <span>
                                        {weeks} {weeks === 1 ? 'week' : 'weeks'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Price per week</span>
                                    <span>
                                        $
                                        {(Number(booking.totalPrice) / weeks).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-semibold">Total Price</span>
                                    <span className="text-2xl font-bold">${Number(booking.totalPrice).toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        {(canCancelBooking() || (booking.status === 'completed' && !booking.review)) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Veiksmai</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {canCancelBooking() && (
                                        <>
                                            <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Atšaukti rezervaciją
                                            </Button>
                                            <p className="text-muted-foreground text-xs">Galima atšaukti rezervaciją iki jos pradžios datos.</p>
                                        </>
                                    )}
                                    {booking.status === 'completed' && !booking.review && (
                                        <>
                                            <Button asChild className="w-full">
                                                <Link href={`/bookings/${booking.id}/review`}>
                                                    <Star className="mr-2 h-4 w-4" />
                                                    Palikti atsiliepimą
                                                </Link>
                                            </Button>
                                            <p className="text-muted-foreground text-xs">Pasidalink savo mintis apie šią jachtą.</p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Užsakymo ID</span>
                                    <span className="font-medium">#{booking.id}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Statusas</span>
                                    <Badge variant={getStatusVariant(booking.status)}>{BookingStatus[booking.status]}</Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Sukurta</span>
                                    <span className="font-medium">{format(parseISO(booking.createdAt), 'MMM dd, yyyy')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
