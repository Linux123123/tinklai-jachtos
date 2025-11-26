import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YachtCard } from '@/components/yacht-card';
import PublicLayout from '@/layouts/public-layout';
import { type Yacht } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface YachtsIndexProps {
    yachts: {
        data: Yacht[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters?: {
        filter?: {
            search?: string;
            type?: string;
            manufacturer?: string;
            model?: string;
            year?: string;
            capacity?: string;
        };
        sort?: string;
    };
    manufacturers: string[];
    manufacturerModels: Record<string, string[]>;
    years: number[];
    capacities: number[];
}

export default function YachtsIndex({ yachts, filters = {}, manufacturers, manufacturerModels, years, capacities }: YachtsIndexProps) {
    const [search, setSearch] = useState(filters.filter?.search || '');
    const [type, setType] = useState(filters.filter?.type || 'all');
    const [manufacturer, setManufacturer] = useState(filters.filter?.manufacturer || 'all');
    const [model, setModel] = useState(filters.filter?.model || 'all');
    const [year, setYear] = useState(filters.filter?.year || 'all');
    const [capacity, setCapacity] = useState(filters.filter?.capacity || 'all');
    const [sortBy, setSortBy] = useState(typeof filters.sort === 'string' ? filters.sort : '-created_at');

    // Get available models based on selected manufacturer
    const availableModels = useMemo(() => {
        if (manufacturer === 'all' || !manufacturerModels) {
            // Return all unique models when no manufacturer is selected
            return Object.values(manufacturerModels || {})
                .flat()
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort();
        }
        return manufacturerModels[manufacturer] || [];
    }, [manufacturer, manufacturerModels]);

    // Reset model when manufacturer changes
    const handleManufacturerChange = (value: string) => {
        setManufacturer(value);
        setModel('all'); // Reset model when manufacturer changes
    };

    const handleFilter = () => {
        router.get(
            '/',
            {
                'filter[search]': search || undefined,
                'filter[type]': type !== 'all' ? type : undefined,
                'filter[manufacturer]': manufacturer !== 'all' ? manufacturer : undefined,
                'filter[model]': model !== 'all' ? model : undefined,
                'filter[year]': year !== 'all' ? year : undefined,
                'filter[capacity]': capacity !== 'all' ? capacity : undefined,
                sort: sortBy || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setType('all');
        setManufacturer('all');
        setModel('all');
        setYear('all');
        setCapacity('all');
        setSortBy('-created_at');
        router.get('/');
    };

    // Defensive fallback for empty lists
    const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];
    const safeYears = Array.isArray(years) ? years : [];
    const safeCapacities = Array.isArray(capacities) ? capacities : [];

    const hasActiveFilters = search || type !== 'all' || manufacturer !== 'all' || model !== 'all' || year !== 'all' || capacity !== 'all';

    return (
        <PublicLayout>
            <Head title="Naršyti jachtas" />
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Naršyti jachtas</h1>
                    <p className="text-muted-foreground mt-1">Raskite tobulą jachtą nuomai</p>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="h-5 w-5" />
                                Filtrai
                            </CardTitle>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                                    <RotateCcw className="mr-1 h-4 w-4" />
                                    Atstatyti
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search Row */}
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                            <Input
                                placeholder="Ieškoti pagal pavadinimą, vietą, gamintoją ar modelį..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9"
                            />
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {/* Type */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Tipas</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Visi tipai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Visi tipai</SelectItem>
                                        <SelectItem value="sailboat">Burlaiviai</SelectItem>
                                        <SelectItem value="motorboat">Motorinės valtys</SelectItem>
                                        <SelectItem value="catamaran">Katamaranai</SelectItem>
                                        <SelectItem value="yacht">Jachtos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Manufacturer */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Gamintojas</Label>
                                <Select value={manufacturer} onValueChange={handleManufacturerChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Visi gamintojai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Visi gamintojai</SelectItem>
                                        {safeManufacturers.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Model */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Modelis</Label>
                                <Select value={model} onValueChange={setModel} disabled={availableModels.length === 0}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Visi modeliai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Visi modeliai</SelectItem>
                                        {availableModels.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Year */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Metai</Label>
                                <Select value={year} onValueChange={setYear}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Visi metai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Visi metai</SelectItem>
                                        {safeYears.map((y) => (
                                            <SelectItem key={y} value={y.toString()}>
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Capacity */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Min. talpa</Label>
                                <Select value={capacity} onValueChange={setCapacity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Bet kokia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Bet kokia</SelectItem>
                                        {safeCapacities.map((c) => (
                                            <SelectItem key={c} value={c.toString()}>
                                                {c}+ svečių
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Rūšiuoti</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rūšiuoti pagal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="-created_at">Naujausi</SelectItem>
                                        <SelectItem value="-reviews_avg_rating">Geriausiai įvertinti</SelectItem>
                                        <SelectItem value="price">Kaina: nuo mažiausios</SelectItem>
                                        <SelectItem value="-price">Kaina: nuo didžiausios</SelectItem>
                                        <SelectItem value="-year">Metai (naujausi)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleFilter} className="flex-1 sm:flex-none">
                                <Search className="mr-2 h-4 w-4" />
                                Ieškoti
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="sm:hidden">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Atstatyti
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {/* Results */}
                {yachts.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground mb-4">Nerasta jachtų, atitinkančių jūsų kriterijus.</p>
                            <Button variant="outline" onClick={handleReset}>
                                Išvalyti filtrus
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="text-muted-foreground mb-4 text-sm">Rodoma {yachts.data.length} jachtų</div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {yachts.data.map((yacht) => (
                                <YachtCard key={yacht.id} yacht={yacht} />
                            ))}
                        </div>
                        {/* Pagination */}
                        <Pagination
                            currentPage={yachts.current_page}
                            lastPage={yachts.last_page}
                            links={yachts.links}
                            total={yachts.total}
                            perPage={yachts.per_page}
                        />
                    </>
                )}
            </div>
        </PublicLayout>
    );
}
