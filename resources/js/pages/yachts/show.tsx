import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { Yacht } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { Anchor, Calendar, MapPin, MessageSquare, Users } from 'lucide-react';
import { useState } from 'react';

interface YachtShowProps {
    yacht: Yacht;
}

export default function YachtShow({ yacht }: YachtShowProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

    const handleBooking = () => {
        router.visit(`/yachts/${yacht.id}/book`);
    };

    const handleMessage = () => {
        // Navigate to messages with yacht owner's user_id
        router.visit(`/messages?user_id=${yacht.owner?.id}`);
    };

    const averageRating = yacht.averageRating || 0;
    const reviewCount = yacht.reviewsCount || 0;

    return (
        <PublicLayout>
            <Head title={yacht.title} />

            <div className="container mx-auto space-y-6 py-6">
                {/* Header */}
                <div>
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
                        {averageRating > 0 && (
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <StarRating rating={averageRating} readonly size="md" />
                                    <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {reviewCount} {reviewCount === 1 ? 'atsiliepimas' : 'atsiliepimai'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Gallery */}
                {yacht.images && yacht.images.length > 0 ? (
                    <Card>
                        <CardContent className="p-6">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {yacht.images.map((image) => (
                                        <CarouselItem key={image.id}>
                                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                                <img src={image.url} alt={yacht.title} className="h-full w-full object-cover" />
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
                    <Card>
                        <CardContent className="p-6">
                            <div className="bg-muted relative flex aspect-video items-center justify-center overflow-hidden rounded-lg">
                                <Anchor className="text-muted-foreground h-24 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Apie šią jachtą</CardTitle>
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
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Tipas</p>
                                    <p className="text-muted-foreground capitalize">{yacht.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Talpa</p>
                                    <p className="text-muted-foreground">{yacht.capacity} svečiai</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Vieta</p>
                                    <p className="text-muted-foreground">{yacht.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Būsena</p>
                                    <Badge variant={yacht.status === 'available' ? 'default' : 'secondary'}>{yacht.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        {yacht.reviews && yacht.reviews.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Atsiliepimai</CardTitle>
                                    <CardDescription>
                                        {reviewCount} {reviewCount === 1 ? 'atsiliepimas' : 'atsiliepimai'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {yacht.reviews.map((review) => (
                                        <div key={review.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{review.user?.name}</p>
                                                    <StarRating rating={review.rating} readonly size="sm" />
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
                        {/* Owner Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Šeimininkauja</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                        <span className="text-lg font-semibold">{yacht.owner?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{yacht.owner?.name}</p>
                                        <p className="text-muted-foreground text-sm">Jachtos savininkas</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={handleMessage}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Susisiekti su savininku
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        {yacht.pricings && yacht.pricings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kainodara</CardTitle>
                                    <CardDescription>Savaitinės nuomos kainos</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {yacht.pricings.map((pricing, index) => (
                                        <div
                                            key={pricing.id}
                                            className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                                                selectedPeriod === index ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setSelectedPeriod(index)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {new Date(pricing.startDate).toLocaleDateString()} -{' '}
                                                        {new Date(pricing.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-2xl font-bold">${pricing.pricePerWeek.toLocaleString()}</p>
                                                    <p className="text-muted-foreground text-xs">per savaitę</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Booking Button */}
                        {yacht.status === 'available' && (
                            <Button size="lg" className="w-full" onClick={handleBooking}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Pateikti rezervacijos užklausą
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
