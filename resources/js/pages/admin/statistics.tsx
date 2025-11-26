import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Star } from 'lucide-react';

interface AdminStatisticsProps {
    yachtsByType: Array<{ type: string; count: number }>;
    bookingsByStatus: Array<{ status: string; count: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
    ratingsDistribution: Array<{ rating: number; count: number }>;
    ratingsOverTime: Array<{ month: string; average_rating: number; count: number }>;
    topYachts: any[];
}

const typeLabels: Record<string, string> = {
    sailboat: 'Burlaiviai',
    motorboat: 'Motorinės valtys',
    catamaran: 'Katamaranai',
    yacht: 'Jachtos',
};

const statusLabels: Record<string, string> = {
    pending: 'Laukiama',
    confirmed: 'Patvirtinta',
    completed: 'Užbaigta',
    cancelled: 'Atšaukta',
    rejected: 'Atmesta',
};

export default function AdminStatistics({
    yachtsByType,
    bookingsByStatus,
    revenueByMonth,
    ratingsDistribution,
    ratingsOverTime,
    topYachts,
}: AdminStatisticsProps) {
    const maxRatingCount = Math.max(...ratingsDistribution.map((r) => r.count), 1);
    const totalRatings = ratingsDistribution.reduce((sum, r) => sum + r.count, 0);
    const averageRating = totalRatings > 0 ? ratingsDistribution.reduce((sum, r) => sum + r.rating * r.count, 0) / totalRatings : 0;

    const maxRevenue = Math.max(...revenueByMonth.map((r) => r.revenue), 1);

    return (
        <AppLayout>
            <Head title="Statistika" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Statistika</h1>
                    <p className="text-muted-foreground mt-1">Išsami sistemos analitika ir įžvalgos</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Ratings Distribution Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Įvertinimų pasiskirstymas
                            </CardTitle>
                            <CardDescription>
                                Bendras vidurkis: {averageRating.toFixed(1)} ({totalRatings} įvertinimai)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ratingsDistribution.map((item) => (
                                    <div key={item.rating} className="flex items-center gap-4">
                                        <div className="flex w-20 items-center gap-1">
                                            <span className="font-medium">{item.rating}</span>
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-muted h-8 overflow-hidden rounded-full">
                                                <div
                                                    className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 text-sm font-medium text-white transition-all duration-500"
                                                    style={{
                                                        width: `${(item.count / maxRatingCount) * 100}%`,
                                                        minWidth: item.count > 0 ? '40px' : '0',
                                                    }}
                                                >
                                                    {item.count > 0 && item.count}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground w-16 text-right text-sm">
                                            {totalRatings > 0 ? ((item.count / totalRatings) * 100).toFixed(0) : 0}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ratings Over Time */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Vidutinis įvertinimas per laiką</CardTitle>
                            <CardDescription>Paskutinių 12 mėnesių įvertinimų tendencija</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ratingsOverTime.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">Nėra duomenų</p>
                            ) : (
                                <div className="flex h-64 items-end gap-2">
                                    {ratingsOverTime.map((item) => {
                                        const avgRating = Number(item.average_rating) || 0;
                                        return (
                                            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                                <div className="relative flex w-full flex-1 flex-col items-center justify-end">
                                                    <div
                                                        className="w-full max-w-12 rounded-t bg-blue-500 transition-all duration-500"
                                                        style={{
                                                            height: `${Math.max((avgRating / 5) * 100, 5)}%`,
                                                            minHeight: '8px',
                                                        }}
                                                        title={`${avgRating.toFixed(1)} (${item.count} įvertinimai)`}
                                                    />
                                                    <span className="absolute -top-6 text-xs font-medium">{avgRating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-muted-foreground text-xs">{item.month.split('-')[1]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Yachts by Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jachtos pagal tipą</CardTitle>
                            <CardDescription>Jachtų tipų pasiskirstymas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {yachtsByType.map((item) => (
                                    <div key={item.type} className="flex items-center justify-between">
                                        <span className="capitalize">{typeLabels[item.type] || item.type}</span>
                                        <span className="font-bold">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bookings by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rezervacijos pagal būseną</CardTitle>
                            <CardDescription>Dabartinis rezervacijų pasiskirstymas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {bookingsByStatus.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <span className="capitalize">{statusLabels[item.status] || item.status}</span>
                                        <span className="font-bold">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue by Month */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Pajamos pagal mėnesį</CardTitle>
                            <CardDescription>Paskutinių 12 mėnesių pajamų tendencija</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {revenueByMonth.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">Nėra duomenų</p>
                            ) : (
                                <div className="flex h-48 items-end gap-2">
                                    {revenueByMonth.map((item) => (
                                        <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                            <div className="relative flex w-full flex-1 flex-col items-center justify-end">
                                                <div
                                                    className="w-full max-w-12 rounded-t bg-green-500 transition-all duration-500"
                                                    style={{
                                                        height: `${(item.revenue / maxRevenue) * 100}%`,
                                                        minHeight: item.revenue > 0 ? '8px' : '0',
                                                    }}
                                                    title={`€${item.revenue.toLocaleString()}`}
                                                />
                                            </div>
                                            <span className="text-muted-foreground text-xs">{item.month.split('-')[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Yachts */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Populiariausios jachtos pagal rezervacijas</CardTitle>
                            <CardDescription>Dažniausiai nuomojamos jachtos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topYachts.map((yacht, index) => (
                                    <div key={yacht.id} className="flex items-center gap-4 rounded-lg border p-4">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <span className="font-semibold">#{index + 1}</span>
                                        </div>
                                        {yacht.primaryImage && (
                                            <img src={yacht.primaryImage.url} alt={yacht.title} className="h-16 w-16 rounded object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">{yacht.title}</p>
                                            <p className="text-muted-foreground text-sm">{yacht.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{yacht.bookingsCount}</p>
                                            <p className="text-muted-foreground text-xs">rezervacijos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
