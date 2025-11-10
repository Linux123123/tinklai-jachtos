import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type Yacht } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye, MapPin, Plus, Users } from 'lucide-react';

interface MyYachtsIndexProps {
    yachts: {
        data: Yacht[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function MyYachtsIndex({ yachts }: MyYachtsIndexProps) {
    return (
        <AppLayout>
            <Head title="Mano jachtos" />

            <div className="container mx-auto py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Mano jachtos</h1>
                        <p className="text-muted-foreground mt-1">Valdyti jūsų jachtų skelbimus</p>
                    </div>
                    <Button asChild>
                        <Link href="/my-yachts/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Pridėti naują jachtą
                        </Link>
                    </Button>
                </div>

                {yachts.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground mb-4">Dar nesate paskelbę jokių jachtų.</p>
                            <Button asChild>
                                <Link href="/my-yachts/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Paskelbti pirmąją jachtą
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {yachts.data.map((yacht) => (
                            <Card key={yacht.id} className="flex flex-col">
                                <CardHeader>
                                    {yacht.primaryImage && (
                                        <img src={yacht.primaryImage.url} alt={yacht.title} className="mb-4 h-48 w-full rounded-md object-cover" />
                                    )}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="line-clamp-1">{yacht.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                <Badge variant={yacht.status === 'available' ? 'default' : 'secondary'}>{yacht.status}</Badge>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="space-y-2 text-sm">
                                        <div className="text-muted-foreground flex items-center">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            {yacht.location}
                                        </div>
                                        <div className="text-muted-foreground flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            Talpa: {yacht.capacity} svečiai
                                        </div>
                                        {yacht.averageRating && (
                                            <div className="flex items-center">
                                                <span className="mr-1 text-yellow-500">★</span>
                                                <span className="font-medium">{yacht.averageRating}</span>
                                                <span className="text-muted-foreground ml-1">({yacht.reviewsCount} atsiliepimai)</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/my-yachts/${yacht.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Peržiūrėti
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/my-yachts/${yacht.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Redaguoti
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {yachts.last_page > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {/* TODO: Add pagination component */}
                        <p className="text-muted-foreground text-sm">
                            Puslapis {yachts.current_page} iš {yachts.last_page}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
