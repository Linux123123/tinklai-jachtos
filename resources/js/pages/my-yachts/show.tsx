import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Yacht } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { Anchor, Edit, MapPin, Star, Trash2, Users } from 'lucide-react';

interface MyYachtShowProps {
    yacht: Yacht;
}

export default function MyYachtShow({ yacht }: MyYachtShowProps) {
    const handleEdit = () => {
        router.visit(`/my-yachts/${yacht.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Ar tikrai norite ištrinti šią jachtą? Šis veiksmas negali būti atšauktas.')) {
            router.delete(`/my-yachts/${yacht.id}`);
        }
    };

    const averageRating = yacht.averageRating || 0;
    const reviewCount = yacht.reviewsCount || 0;

    return (
        <AppLayout>
            <Head title={yacht.title} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header with Actions */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{yacht.title}</h1>
                        <div className="text-muted-foreground mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{yacht.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Anchor className="h-4 w-4" />
                                <span className="capitalize">{yacht.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{yacht.capacity} svečiai</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" />
                            Redaguoti
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Ištrinti
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skelbimo būsena</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Dabartinė būsena:</span>
                                    <Badge variant={yacht.status === 'available' ? 'default' : 'secondary'}>{yacht.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aprašymas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{yacht.description}</p>
                            </CardContent>
                        </Card>

                        {/* Bookings */}
                        {yacht.bookings && yacht.bookings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rezervacijos</CardTitle>
                                    <CardDescription>
                                        {yacht.bookings.length} aktyvi{yacht.bookings.length > 1 ? 'os rezervacijos' : ' rezervacija'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {yacht.bookings.map((booking) => (
                                        <div key={booking.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{booking.user?.name || 'Svečias'}</p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {new Date(booking.startDate).toLocaleDateString()} -{' '}
                                                        {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge>{booking.status}</Badge>
                                            </div>
                                            <Separator />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews */}
                        {yacht.reviews && yacht.reviews.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Atsiliepimai</CardTitle>
                                    <CardDescription>
                                        {reviewCount} {reviewCount === 1 ? 'atsiliepimas' : 'atsiliepimai'}
                                        {averageRating > 0 && <span className="ml-2">• Vidutinis: {averageRating} ★</span>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {yacht.reviews.map((review) => (
                                        <div key={review.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{review.user?.name}</p>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${
                                                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                                            <Separator />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Greita statistika</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Tipas</span>
                                    <span className="font-medium capitalize">{yacht.type}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Talpa</span>
                                    <span className="font-medium">{yacht.capacity} svečiai</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Vieta</span>
                                    <span className="font-medium">{yacht.location}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Iš viso rezervacijų</span>
                                    <span className="font-medium">{yacht.bookings?.length || 0}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Iš viso atsiliepimų</span>
                                    <span className="font-medium">{reviewCount}</span>
                                </div>
                                {averageRating > 0 && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Vid. įvertinimas</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{averageRating}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing Summary */}
                        {yacht.pricings && yacht.pricings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kainų laikotarpiai</CardTitle>
                                    <CardDescription>
                                        {yacht.pricings.length} aktyv{yacht.pricings.length === 1 ? 'us laikotarpis' : 'ūs laikotarpiai'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {yacht.pricings.map((pricing) => (
                                        <div key={pricing.id} className="rounded-lg border p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-muted-foreground text-xs">
                                                        {new Date(pricing.startDate).toLocaleDateString()} -{' '}
                                                        {new Date(pricing.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="font-semibold">
                                                        ${pricing.pricePerWeek}
                                                        <span className="text-muted-foreground ml-1 text-xs">/savaitė</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Images Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nuotraukos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {yacht.images?.length || 0} {yacht.images?.length === 1 ? 'nuotrauka' : 'nuotraukos'} įkelta
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
