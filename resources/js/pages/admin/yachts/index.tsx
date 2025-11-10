import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YachtCard } from '@/components/yacht-card';
import AppLayout from '@/layouts/app-layout';
import type { Yacht } from '@/types/models';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, MoreVertical, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AdminYachtsIndexProps {
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
        status?: string;
        type?: string;
    };
}

export default function AdminYachtsIndex({ yachts, filters = {} }: AdminYachtsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');

    const handleFilter = () => {
        router.get(
            '/admin/yachts',
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                type: type !== 'all' ? type : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setType('all');
        router.get('/admin/yachts');
    };

    const handleDelete = (yachtId: number) => {
        if (confirm('Ar tikrai norite ištrinti šią jachtą? Šio veiksmo negalima atšaukti.')) {
            router.delete(`/admin/yachts/${yachtId}`);
        }
    };

    const handleStatusChange = (yachtId: number, newStatus: string) => {
        router.post(`/admin/yachts/${yachtId}/update-status`, {
            status: newStatus,
        });
    };

    return (
        <AppLayout>
            <Head title="Valdyti jachtas - Administratorius" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Valdyti jachtas</h1>
                    <p className="text-muted-foreground mt-1">Peržiūrėkite ir valdykite visas sistemoje esančias jachtas</p>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="md:col-span-2">
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

                            {/* Status */}
                            <div>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Visos būsenos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Visos būsenos</SelectItem>
                                        <SelectItem value="available">Prieinama</SelectItem>
                                        <SelectItem value="unavailable">Neprieinama</SelectItem>
                                        <SelectItem value="under_maintenance">Priežiūra</SelectItem>
                                    </SelectContent>
                                </Select>
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

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{yachts.total}</div>
                            <p className="text-muted-foreground text-sm">Visos jachtos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{yachts.data.filter((y) => y.status === 'available').length}</div>
                            <p className="text-muted-foreground text-sm">Prieinamos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{yachts.data.filter((y) => y.status === 'unavailable').length}</div>
                            <p className="text-muted-foreground text-sm">Neprieinamos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{yachts.data.filter((y) => y.status === 'maintenance').length}</div>
                            <p className="text-muted-foreground text-sm">Maintenance</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Yacht List */}
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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {yachts.data.map((yacht) => (
                            <div key={yacht.id} className="relative">
                                <YachtCard
                                    yacht={yacht}
                                    showOwner={true}
                                    actionButton={
                                        <div className="flex w-full gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/yachts/${yacht.id}`}>Peržiūrėti</Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Veiksmai</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/yachts/${yacht.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Redaguoti
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>Keisti būseną</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(yacht.id, 'available')}>
                                                        Nustatyti prieinamą
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(yacht.id, 'unavailable')}>
                                                        Nustatyti neprieinamą
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(yacht.id, 'under_maintenance')}>
                                                        Nustatyti priežiūrą
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(yacht.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Ištrinti
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
