import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { Yacht } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Anchor, Building2, Calendar, Edit, MapPin, Ship, Trash2, Users } from 'lucide-react';

interface AdminYachtShowProps {
    yacht: Yacht;
}

const YachtStatus: Record<string, string> = {
    available: 'Prieinama',
    unavailable: 'Neprieinama',
    under_maintenance: 'Priežiūra',
    maintenance: 'Priežiūra',
};

const YachtType: Record<string, string> = {
    sailboat: 'Burinė valtis',
    motorboat: 'Motorinė valtis',
    catamaran: 'Katamaranas',
    yacht: 'Jachta',
};

export default function AdminYachtShow({ yacht }: AdminYachtShowProps) {
    const handleDelete = () => {
        if (confirm('Ar tikrai norite ištrinti šią jachtą? Šis veiksmas negrįžtamas.')) {
            router.delete(`/admin/yachts/${yacht.id}`);
        }
    };

    const handleStatusChange = (status: string) => {
        router.post(`/admin/yachts/${yacht.id}/update-status`, { status });
    };

    return (
        <AppLayout>
            <Head title={`${yacht.title} - Administratorius`} />

            <div className="container mx-auto py-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Link href="/admin/yachts" className="text-muted-foreground hover:text-foreground text-sm">
                                ← Grįžti į sąrašą
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold">{yacht.title}</h1>
                        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{yacht.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Anchor className="h-4 w-4" />
                                <span>{YachtType[yacht.type] || yacht.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{yacht.capacity} svečiai</span>
                            </div>
                            <Badge variant={yacht.status === 'available' ? 'default' : 'secondary'}>
                                {YachtStatus[yacht.status] || yacht.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/yachts/${yacht.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Redaguoti
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Ištrinti
                        </Button>
                    </div>
                </div>

                {/* Image Gallery */}
                {yacht.images && yacht.images.length > 0 ? (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {yacht.images.map((image) => (
                                        <CarouselItem key={image.id}>
                                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                                <img src={image.url} alt={yacht.title} className="h-full w-full object-cover" />
                                                {image.isPrimary && <Badge className="absolute bottom-2 left-2">Pagrindinė</Badge>}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mb-6">
                        <CardContent className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Nėra nuotraukų</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aprašymas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{yacht.description}</p>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Specifikacijos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div className="flex items-start gap-3">
                                    <Anchor className="text-muted-foreground mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Tipas</p>
                                        <p className="text-muted-foreground">{YachtType[yacht.type] || yacht.type}</p>
                                    </div>
                                </div>
                                {yacht.manufacturer && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="text-muted-foreground mt-0.5 h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Gamintojas</p>
                                            <p className="text-muted-foreground">{yacht.manufacturer}</p>
                                        </div>
                                    </div>
                                )}
                                {yacht.model && (
                                    <div className="flex items-start gap-3">
                                        <Ship className="text-muted-foreground mt-0.5 h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Modelis</p>
                                            <p className="text-muted-foreground">{yacht.model}</p>
                                        </div>
                                    </div>
                                )}
                                {yacht.year && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Metai</p>
                                            <p className="text-muted-foreground">{yacht.year}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <Users className="text-muted-foreground mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Talpa</p>
                                        <p className="text-muted-foreground">{yacht.capacity} svečiai</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Vieta</p>
                                        <p className="text-muted-foreground">{yacht.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bookings */}
                        {yacht.bookings && yacht.bookings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rezervacijos</CardTitle>
                                    <CardDescription>{yacht.bookings.length} rezervacijų</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {yacht.bookings.slice(0, 5).map((booking) => (
                                            <div key={booking.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <p className="font-medium">{booking.user?.name}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {new Date(booking.startDate).toLocaleDateString()} -{' '}
                                                        {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews */}
                        {yacht.reviews && yacht.reviews.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Atsiliepimai</CardTitle>
                                    <CardDescription>{yacht.reviews.length} atsiliepimų</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {yacht.reviews.map((review) => (
                                            <div key={review.id}>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">{review.user?.name}</p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold">{review.rating}</span>
                                                        <span className="text-yellow-500">★</span>
                                                    </div>
                                                </div>
                                                {review.comment && <p className="text-muted-foreground mt-1 text-sm">{review.comment}</p>}
                                                <Separator className="mt-3" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Savininkas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {yacht.owner ? (
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <span className="text-lg font-semibold">{yacht.owner.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{yacht.owner.name}</p>
                                            <p className="text-muted-foreground text-sm">{yacht.owner.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Nėra savininko informacijos</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Būsenos valdymas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={yacht.status === 'available' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => handleStatusChange('available')}
                                >
                                    Prieinama
                                </Button>
                                <Button
                                    variant={yacht.status === 'unavailable' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => handleStatusChange('unavailable')}
                                >
                                    Neprieinama
                                </Button>
                                <Button
                                    variant={yacht.status === 'under_maintenance' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => handleStatusChange('under_maintenance')}
                                >
                                    Priežiūra
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        {yacht.pricings && yacht.pricings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kainodara</CardTitle>
                                    <CardDescription>Savaitinės kainos</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {yacht.pricings.map((pricing) => (
                                        <div key={pricing.id} className="rounded-lg border p-3">
                                            <p className="text-sm">
                                                {new Date(pricing.startDate).toLocaleDateString()} - {new Date(pricing.endDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-lg font-bold">€{pricing.pricePerWeek}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
