import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { Yacht } from '@/types/models';
import { Head, router, useForm } from '@inertiajs/react';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { Anchor, Calendar as CalendarIcon, Info, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingCreateProps {
    yacht: Yacht;
}

interface PriceBreakdown {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    pricePerWeek: number;
}

const YachtType: Record<any, any> = {
    'sailboat': 'Jachta',
    'motorboat': 'Motorinė valtis',
    'catamaran': 'Katamaras',
    'yacht': 'Jachta',
}

export default function BookingCreate({ yacht }: BookingCreateProps) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});

    const { data, setData, post, processing } = useForm({
        start_date: '',
        end_date: '',
        notes: '',
    });

    // Calculate price when dates change
    useEffect(() => {
        if (startDate && endDate) {
            const days = differenceInDays(endDate, startDate);

            // Validate minimum 7 days
            if (days < 7) {
                setErrors({ endDate: 'Minimali rezervacijos trukmė yra 7 dienos' });
                setPriceBreakdown([]);
                setTotalPrice(0);
                return;
            }

            // Check for conflicts with existing bookings
            const hasConflict = yacht.bookings?.some((booking) => {
                if (!['pending', 'confirmed'].includes(booking.status)) return false;

                const bookingStart = parseISO(booking.startDate);
                const bookingEnd = parseISO(booking.endDate);

                return (
                    (startDate >= bookingStart && startDate <= bookingEnd) ||
                    (endDate >= bookingStart && endDate <= bookingEnd) ||
                    (startDate <= bookingStart && endDate >= bookingEnd)
                );
            });

            if (hasConflict) {
                setErrors({ startDate: 'Šios datos sutampa su kita rezervacija' });
                setPriceBreakdown([]);
                setTotalPrice(0);
                return;
            }

            setErrors({});

            // Calculate price breakdown by week
            const weeks = Math.ceil(days / 7);
            const breakdown: PriceBreakdown[] = [];
            let total = 0;

            for (let i = 0; i < weeks; i++) {
                const weekStart = addDays(startDate, i * 7);
                const weekEnd = i === weeks - 1 ? endDate : addDays(weekStart, 7);

                // Find applicable pricing for this week
                const applicablePricing = yacht.pricings?.find((pricing) => {
                    const pricingStart = parseISO(pricing.startDate);
                    const pricingEnd = parseISO(pricing.endDate);
                    return weekStart >= pricingStart && weekStart <= pricingEnd;
                });

                const pricePerWeek = Number(applicablePricing?.pricePerWeek || 0);

                breakdown.push({
                    weekNumber: i + 1,
                    startDate: weekStart,
                    endDate: weekEnd,
                    pricePerWeek,
                });

                total += pricePerWeek;
            }

            setPriceBreakdown(breakdown);
            setTotalPrice(total);

            // Update form data
            setData({
                ...data,
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            });
        } else {
            setPriceBreakdown([]);
            setTotalPrice(0);
        }
    }, [startDate, endDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setErrors({ startDate: 'Prašome pasirinkti rezervacijos datas' });
            return;
        }

        if (Object.keys(errors).length > 0) {
            return;
        }

        post(`/yachts/${yacht.id}/book`);
    };

    // Get booked dates to disable in calendar
    const bookedDates =
        yacht.bookings
            ?.filter((booking) => ['pending', 'confirmed'].includes(booking.status))
            .flatMap((booking) => {
                const start = parseISO(booking.startDate);
                const end = parseISO(booking.endDate);
                const dates: Date[] = [];
                let current = start;

                while (current <= end) {
                    dates.push(new Date(current));
                    current = addDays(current, 1);
                }

                return dates;
            }) || [];

    return (
        <PublicLayout>
            <Head title={`Rezervuoti ${yacht.title}`} />

            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.visit(`/yachts/${yacht.id}`)} className="mb-4">
                        ← Atgal į jachtą
                    </Button>
                    <h1 className="text-3xl font-bold">Rezervuoti {yacht.title}</h1>
                    <div className="text-muted-foreground mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{yacht.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Anchor className="h-4 w-4" />
                            <span className="capitalize">{YachtType[yacht.type]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{yacht.capacity} svečiai</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pasirinkti datas</CardTitle>
                                <CardDescription>Minimali rezervacijos trukmė yra 7 dienos (1 savaitė)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription>Rezervacijos mokamos už savaitę. Kainos gali skirtis priklausomai nuo sezono.</AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {/* Start Date */}
                                        <div className="space-y-2">
                                            <Label>Pradžios data</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !startDate && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {startDate ? format(startDate, 'PPP') : <span>Pasirinkti datą</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={startDate}
                                                        onSelect={setStartDate}
                                                        disabled={(date: Date) =>
                                                            date < new Date() || bookedDates.some((d) => d.toDateString() === date.toDateString())
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.startDate && <p className="text-destructive text-sm">{errors.startDate}</p>}
                                        </div>

                                        {/* End Date */}
                                        <div className="space-y-2">
                                            <Label>Pabaigos data</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !endDate && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {endDate ? format(endDate, 'PPP') : <span>Pasirinkti datą</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={endDate}
                                                        onSelect={setEndDate}
                                                        disabled={(date: Date) =>
                                                            !startDate ||
                                                            date <= startDate ||
                                                            bookedDates.some((d) => d.toDateString() === date.toDateString())
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.endDate && <p className="text-destructive text-sm">{errors.endDate}</p>}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Specialūs pageidavimai (neprivaloma)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Bet kokie specialūs pageidavimai ar pastabos savininkui..."
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing || !startDate || !endDate || Object.keys(errors).length > 0 || totalPrice === 0}
                                    >
                                        Pateikti rezervacijos užklausą
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kainos suvestinė</CardTitle>
                                {startDate && endDate && (
                                    <CardDescription>
                                        {differenceInDays(endDate, startDate)} dienos ({Math.ceil(differenceInDays(endDate, startDate) / 7)} savaitės)
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {priceBreakdown.length > 0 ? (
                                    <>
                                        {priceBreakdown.map((week) => (
                                            <div key={week.weekNumber}>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Savaitė {week.weekNumber}</span>
                                                    <span className="font-medium">${week.pricePerWeek.toLocaleString()}</span>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    {format(week.startDate, 'MMM dd')} - {format(week.endDate, 'MMM dd, yyyy')}
                                                </p>
                                                <Separator className="mt-2" />
                                            </div>
                                        ))}

                                        <div className="pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">Iš viso</span>
                                                <span className="text-2xl font-bold">${totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground py-8 text-center text-sm">Pasirinkite datas, kad pamatytumėte kainą</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Yacht Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Jachtos detalės</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tipas</span>
                                    <span className="font-medium capitalize">{YachtType[yacht.type]}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Talpa</span>
                                    <span className="font-medium">{yacht.capacity} svečiai</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Vieta</span>
                                    <span className="font-medium">{yacht.location}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
