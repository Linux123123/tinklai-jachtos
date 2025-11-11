import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YachtCard } from '@/components/yacht-card';
import PublicLayout from '@/layouts/public-layout';
import { type Yacht } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

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
        search?: string;
        type?: string;
        capacity?: number;
        location?: string;
        sortBy?: string;
    };
}

export default function YachtsIndex({ yachts, filters = {} }: YachtsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [capacity, setCapacity] = useState(filters.capacity?.toString() || '');
    const [sortBy, setSortBy] = useState(filters.sortBy || 'latest');

    const handleFilter = () => {
        router.get(
            '/',
            {
                search: search || undefined,
                type: type !== 'all' ? type : undefined,
                capacity: capacity || undefined,
                sortBy: sortBy || undefined,
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
        setCapacity('');
        setSortBy('latest');
        router.get('/');
    };

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
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                    <Input
                                        placeholder="Ieškoti pagal pavadinimą ar vietą..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div>
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

                            {/* Capacity */}
                            <div>
                                <Input
                                    type="number"
                                    placeholder="Minimali talpa"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    min="1"
                                />
                            </div>

                            {/* Sort */}
                            <div>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rūšiuoti pagal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Naujausi</SelectItem>
                                        <SelectItem value="rating">Geriausiai įvertinti</SelectItem>
                                        <SelectItem value="price_low">Kaina: nuo mažiausios</SelectItem>
                                        <SelectItem value="price_high">Kaina: nuo didžiausios</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleFilter}>
                                <Search className="mr-2 h-4 w-4" />
                                Ieškoti
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Atstatyti filtrus
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
                        <div className="text-muted-foreground mb-4 text-sm">
                            Rodoma {yachts.data.length} jachtų
                        </div>

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
