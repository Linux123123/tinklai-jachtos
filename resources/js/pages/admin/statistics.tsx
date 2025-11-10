import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface AdminStatisticsProps {
    yachtsByType: Array<{ type: string; count: number }>;
    bookingsByStatus: Array<{ status: string; count: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
    topYachts: any[];
}

export default function AdminStatistics({ yachtsByType, bookingsByStatus, revenueByMonth, topYachts }: AdminStatisticsProps) {
    return (
        <AppLayout>
            <Head title="Statistika" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Statistika</h1>
                    <p className="text-muted-foreground mt-1">Išsami sistemos analitika ir įžvalgos</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                                        <span className="capitalize">{item.type}</span>
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
                                        <span className="capitalize">{item.status}</span>
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
                            <div className="space-y-3">
                                {revenueByMonth.map((item) => (
                                    <div key={item.month} className="flex items-center justify-between">
                                        <span>{item.month}</span>
                                        <span className="font-bold">${item.revenue.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
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
