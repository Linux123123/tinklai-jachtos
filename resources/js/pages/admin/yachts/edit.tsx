import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Yacht } from '@/types/models';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface AdminYachtEditProps {
    yacht: Yacht;
}

export default function AdminYachtEdit({ yacht }: AdminYachtEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: yacht.title || '',
        description: yacht.description || '',
        type: yacht.type || 'sailboat',
        capacity: yacht.capacity || 1,
        location: yacht.location || '',
        status: yacht.status || 'available',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/yachts/${yacht.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Redaguoti ${yacht.title} - Administratorius`} />

            <div className="container mx-auto max-w-3xl py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Redaguoti jachtą</h1>
                    <p className="text-muted-foreground mt-1">Atnaujinti jachtos informaciją</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Jachtos informacija</CardTitle>
                        <CardDescription>Redaguokite jachtos informaciją žemiau</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Pavadinimas *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="pvz., Bavaria Cruiser 46"
                                    className="mt-2"
                                    required
                                />
                                {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Aprašymas *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Aprašykite jachtą..."
                                    rows={5}
                                    className="mt-2"
                                    required
                                />
                                {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
                            </div>

                            {/* Type and Capacity */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="type">Tipas *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value as any)}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Pasirinkite jachtos tipą" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sailboat">Burinė valtis</SelectItem>
                                            <SelectItem value="motorboat">Motorinė valtis</SelectItem>
                                            <SelectItem value="catamaran">Katamaranas</SelectItem>
                                            <SelectItem value="yacht">Jachta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-destructive mt-1 text-sm">{errors.type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="capacity">Talpa (svečiai) *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                        className="mt-2"
                                        required
                                    />
                                    {errors.capacity && <p className="text-destructive mt-1 text-sm">{errors.capacity}</p>}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <Label htmlFor="location">Vieta *</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="pvz., Nida, Lietuva"
                                    className="mt-2"
                                    required
                                />
                                {errors.location && <p className="text-destructive mt-1 text-sm">{errors.location}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Būsena *</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as any)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Pasirinkite būseną" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Prieinama</SelectItem>
                                        <SelectItem value="unavailable">Neprieinama</SelectItem>
                                        <SelectItem value="under_maintenance">Techninė priežiūra</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-destructive mt-1 text-sm">{errors.status}</p>}
                            </div>

                            {/* Owner Info */}
                            {yacht.owner && (
                                <div className="rounded-lg border p-4">
                                    <p className="text-sm font-medium">Savininko informacija</p>
                                    <p className="text-muted-foreground mt-1 text-sm">{yacht.owner.name}</p>
                                    <p className="text-muted-foreground text-sm">{yacht.owner.email}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Išsaugoma...' : 'Išsaugoti pakeitimus'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Atšaukti
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Images Section */}
                {yacht.images && yacht.images.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Jachtos nuotraukos</CardTitle>
                            <CardDescription>{yacht.images.length} nuotraukos įkeltos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {yacht.images.map((image) => (
                                    <div key={image.id} className="relative aspect-video overflow-hidden rounded-lg">
                                        <img src={image.url} alt={yacht.title} className="h-full w-full object-cover" />
                                        {image.isPrimary && (
                                            <div className="bg-primary absolute bottom-2 left-2 rounded px-2 py-1 text-xs text-white">Pagrindinė</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
