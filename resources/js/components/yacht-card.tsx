import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Yacht } from '@/types';
import { Link } from '@inertiajs/react';
import { MapPin, Star, Users } from 'lucide-react';

interface YachtCardProps {
    yacht: Yacht;
    showOwner?: boolean;
    actionButton?: React.ReactNode;
}

export function YachtCard({ yacht, showOwner = false, actionButton }: YachtCardProps) {
    return (
        <Card className="flex flex-col transition-shadow hover:shadow-lg">
            <CardHeader className="p-0">
                {yacht.primaryImage ? (
                    <img src={yacht.primaryImage.url} alt={yacht.title} className="h-48 w-full rounded-t-lg object-cover" />
                ) : (
                    <div className="bg-muted flex h-48 w-full items-center justify-center rounded-t-lg">
                        <span className="text-muted-foreground">Nėra nuotraukos</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 pt-6">
                <CardTitle className="mb-2 line-clamp-1">{yacht.title}</CardTitle>
                <CardDescription className="mb-4 line-clamp-2">{yacht.description}</CardDescription>

                <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground flex items-center">
                        <Badge variant="outline" className="mr-2">
                            {yacht.type}
                        </Badge>
                        {yacht.status && <Badge variant={yacht.status === 'available' ? 'default' : 'secondary'}>{yacht.status}</Badge>}
                    </div>
                    <div className="text-muted-foreground flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {yacht.location}
                    </div>
                    <div className="text-muted-foreground flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Iki {yacht.capacity} svečių
                    </div>
                    {showOwner && yacht.owner && (
                        <div className="text-muted-foreground flex items-center">
                            <span className="text-xs">Savininkas: {yacht.owner.name}</span>
                        </div>
                    )}
                    {yacht.averageRating && yacht.averageRating > 0 ? (
                        <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{yacht.averageRating}</span>
                            <span className="text-muted-foreground ml-1">
                                ({yacht.reviewsCount} {yacht.reviewsCount === 1 ? 'atsiliepimas' : yacht.reviewsCount < 10 ? 'atsiliepimai' : 'atsiliepimų'})
                            </span>
                        </div>
                    ) : null}
                </div>
            </CardContent>

            <CardFooter>
                {actionButton || (
                    <Button asChild className="w-full">
                        <Link href={`/yachts/${yacht.id}`}>Peržiūrėti detales</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
