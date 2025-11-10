import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Anchor, Calendar, DollarSign, Star, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TopOwner {
    id: number;
    name: string;
    email: string;
    averageRating: number;
    totalReviews: number;
}

interface Statistics {
    totalYachts: number;
    activeYachts: number;
    totalUsers: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    totalReviews: number;
    averageRating: number;
    totalRevenue: number;
}

interface AdminDashboardProps {
    topOwners: TopOwner[];
    statistics: Statistics;
    recentBookings: any[];
    bookingTrends: any[];
}

export default function AdminDashboard({ topOwners, statistics, recentBookings, bookingTrends }: AdminDashboardProps) {
    return (
        <AppLayout>
            <Head title="Administravimo skydelis" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Administravimo skydelis</h1>
                    <p className="text-muted-foreground mt-1">Sistemos apžvalga ir statistika</p>
                </div>

                {/* Statistics Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iš viso jachtų</CardTitle>
                            <Anchor className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalYachts}</div>
                            <p className="text-muted-foreground text-xs">{statistics.activeYachts} aktyvios</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iš viso vartotojų</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalUsers}</div>
                            <p className="text-muted-foreground text-xs">Registruoti vartotojai</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iš viso rezervacijų</CardTitle>
                            <Calendar className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalBookings}</div>
                            <p className="text-muted-foreground text-xs">{statistics.pendingBookings} laukiančios</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bendra pajamos</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${statistics.totalRevenue?.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">Iš patvirtintų rezervacijų</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vidutinis įvertinimas</CardTitle>
                            <Star className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.averageRating}</div>
                            <p className="text-muted-foreground text-xs">{statistics.totalReviews} atsiliepimai</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Patvirtintos</CardTitle>
                            <TrendingUp className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.confirmedBookings}</div>
                            <p className="text-muted-foreground text-xs">Aktyvios rezervacijos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Užbaigtos</CardTitle>
                            <Calendar className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.completedBookings}</div>
                            <p className="text-muted-foreground text-xs">Baigtos nuomos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Laukiančios</CardTitle>
                            <Calendar className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.pendingBookings}</div>
                            <p className="text-muted-foreground text-xs">Laukiančios patvirtinimo</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 5 Owners */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 jachtų savininkai</CardTitle>
                            <CardDescription>Geriausiai įvertinti jachtų savininkai pagal vidutinį įvertinimą</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topOwners.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">Kol kas atsiliepimų nėra</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topOwners}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis domain={[0, 5]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="averageRating" fill="#3b82f6" name="Vidutinis įvertinimas" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Booking Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rezervacijų tendencijos</CardTitle>
                            <CardDescription>Rezervacijos per paskutinius 12 mėnesių</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookingTrends.length === 0 ? (
                                <p className="text-muted-foreground py-8 text-center">Kol kas rezervacijų duomenų nėra</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={bookingTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Rezervacijos" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
