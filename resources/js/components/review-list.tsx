import { StarRating } from '@/components/star-rating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Review } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface ReviewListProps {
    reviews: Review[];
    title?: string;
    description?: string;
    emptyMessage?: string;
    showYachtName?: boolean;
    className?: string;
}

export function ReviewList({
    reviews,
    title = 'Atsiliepimai',
    description,
    emptyMessage = 'Kol kas nėra atsiliepimų',
    showYachtName = false,
    className,
}: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
                        <MessageSquare className="mb-4 h-12 w-12 opacity-50" />
                        <p>{emptyMessage}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    {/* User Avatar */}
                                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                        <span className="text-sm font-semibold">{review.user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>

                                    <div>
                                        <p className="font-medium">{review.user?.name}</p>
                                        {showYachtName && review.yacht && (
                                            <p className="text-muted-foreground text-sm">Įvertino {review.yacht.title}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="text-right">
                                <p className="text-muted-foreground text-sm">
                                    {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: { formatDistance: (token: string) => token } }) : 'Neseniai'}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-2">
                            <StarRating rating={review.rating} readonly size="sm" />
                        </div>

                        {/* Comment */}
                        {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
