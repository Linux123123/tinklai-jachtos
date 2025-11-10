import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Pricing, Yacht } from '@/types/models';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, ImagePlus, Plus, Star, Trash2, Upload } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface EditYachtProps {
    yacht: Yacht;
}

export default function EditYacht({ yacht }: EditYachtProps) {
    // Convert ISO date strings to YYYY-MM-DD format for date inputs
    const formatPricingsForEdit = (pricings: Pricing[] | undefined): Pricing[] => {
        if (!pricings) return [];
        return pricings.map(pricing => ({
            ...pricing,
            startDate: pricing.startDate ? pricing.startDate.split('T')[0] : '',
            endDate: pricing.endDate ? pricing.endDate.split('T')[0] : '',
        }));
    };

    const [pricings, setPricings] = useState<Pricing[]>(formatPricingsForEdit(yacht.pricings));
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

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
        put(`/owner/yachts/${yacht.id}`);
    };

    const handleAddPricing = () => {
        const newPricing: Partial<Pricing> = {
            startDate: '',
            endDate: '',
            pricePerWeek: '0',
        };
        setPricings([...pricings, newPricing as Pricing]);
    };

    const handleRemovePricing = (index: number) => {
        const pricingToRemove = pricings[index];
        if (pricingToRemove.id) {
            // If it has an ID, send delete request
            router.delete(`/my-yachts/${yacht.id}/pricings/${pricingToRemove.id}`, {
                preserveState: true,
            });
        }
        setPricings(pricings.filter((_, i) => i !== index));
    };

    const handleUpdatePricing = (index: number, field: keyof Pricing, value: any) => {
        const updated = [...pricings];
        updated[index] = { ...updated[index], [field]: value };
        setPricings(updated);
    };

    const handleSavePricing = (index: number) => {
        const pricing = pricings[index];
        const pricingData = {
            start_date: pricing.startDate,
            end_date: pricing.endDate,
            price_per_week: pricing.pricePerWeek,
        };

        if (pricing.id) {
            // Update existing pricing
            router.put(`/my-yachts/${yacht.id}/pricings/${pricing.id}`, pricingData, {
                preserveState: true,
                onSuccess: () => {
                    // Pricing updated
                },
            });
        } else {
            // Create new pricing
            router.post(`/my-yachts/${yacht.id}/pricings`, pricingData, {
                preserveState: true,
                onSuccess: () => {
                    // Pricing created
                },
            });
        }
    };

    const handleImageUpload = () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const formData = new FormData();
        Array.from(selectedFiles).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        setUploading(true);
        router.post(`/my-yachts/${yacht.id}/images`, formData, {
            preserveState: true,
            onSuccess: () => {
                setSelectedFiles(null);
                // Reset file input
                const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Ar tikrai norite ištrinti šią nuotrauką?')) {
            router.delete(`/my-yachts/${yacht.id}/images/${imageId}`, {
                preserveState: true,
            });
        }
    };

    const handleSetPrimaryImage = (imageId: number) => {
        router.post(`/my-yachts/${yacht.id}/images/${imageId}/primary`, {}, {
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${yacht.title}`} />

            <div className="container mx-auto max-w-4xl py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Redaguoti jachtą</h1>
                    <p className="text-muted-foreground">Atnaujinkite jachtos informaciją ir kainas</p>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pagrindinė informacija</CardTitle>
                            <CardDescription>Atnaujinkite jachtos informaciją</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Pavadinimas</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Prabangios jachtos pavadinimas"
                                        required
                                    />
                                    {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="description">Aprašymas</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Aprašykite savo jachtą, jos savybes, patogumus..."
                                        rows={5}
                                        required
                                    />
                                    {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="type">Tipas</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Pasirinkti tipą" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sailboat">Burinis laivas</SelectItem>
                                                <SelectItem value="motorboat">Motorinis laivas</SelectItem>
                                                <SelectItem value="catamaran">Katamaranas</SelectItem>
                                                <SelectItem value="yacht">Jachta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <p className="text-destructive mt-1 text-sm">{errors.type}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="capacity">Talpa (svečiai)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            min="1"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                            required
                                        />
                                        {errors.capacity && <p className="text-destructive mt-1 text-sm">{errors.capacity}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="location">Vieta</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Klaipėda"
                                            required
                                        />
                                        {errors.location && <p className="text-destructive mt-1 text-sm">{errors.location}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Būsena</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value as 'available' | 'unavailable' | 'maintenance')}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Pasirinkti būseną" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Prieinama</SelectItem>
                                                <SelectItem value="unavailable">Neprieinama</SelectItem>
                                                <SelectItem value="maintenance">Priežiūra</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-destructive mt-1 text-sm">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit('/my-yachts')}>
                                        Atšaukti
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saugoma...' : 'Išsaugoti pakeitimus'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Pricing Management */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Sezoninės kainos</CardTitle>
                                    <CardDescription>Nustatykite skirtingus savaitės tarifus skirtingiems sezonams</CardDescription>
                                </div>
                                <Button onClick={handleAddPricing} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Pridėti laikotarpį
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pricings.length === 0 ? (
                                <div className="text-muted-foreground py-8 text-center">
                                    <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>Nėra apibrėžtų kainų laikotarpių</p>
                                    <p className="text-sm">Spustelėkite „Pridėti laikotarpį", kad nustatytumėte tarifus</p>
                                </div>
                            ) : (
                                pricings.map((pricing, index) => (
                                    <div key={pricing.id || index}>
                                        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
                                            <div className="md:col-span-3">
                                                <Label>Pradžios data</Label>
                                                <Input
                                                    type="date"
                                                    value={pricing.startDate}
                                                    onChange={(e) => handleUpdatePricing(index, 'startDate', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <Label>Pabaigos data</Label>
                                                <Input
                                                    type="date"
                                                    value={pricing.endDate}
                                                    onChange={(e) => handleUpdatePricing(index, 'endDate', e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <Label>Kaina per savaitę ($)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={pricing.pricePerWeek}
                                                    onChange={(e) => handleUpdatePricing(index, 'pricePerWeek', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2 md:col-span-1">
                                                <Button type="button" size="sm" onClick={() => handleSavePricing(index)}>
                                                    Išsaugoti
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemovePricing(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        {index < pricings.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Image Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Nuotraukos</CardTitle>
                            <CardDescription>Valdykite jachtos nuotraukas (maks. 10 nuotraukų, po 5MB kiekviena)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Images */}
                            {yacht.images && yacht.images.length > 0 ? (
                                <div>
                                    <h3 className="mb-4 text-sm font-medium">Esamos nuotraukos ({yacht.images.length}/10)</h3>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {yacht.images.map((image) => (
                                            <div key={image.id} className="group relative aspect-video overflow-hidden rounded-lg border">
                                                <img src={image.url} alt={yacht.title} className="h-full w-full object-cover" />
                                                
                                                {/* Primary badge */}
                                                {image.isPrimary && (
                                                    <div className="bg-primary absolute left-2 top-2 rounded px-2 py-1 text-xs font-medium text-white">
                                                        <Star className="mr-1 inline h-3 w-3" />
                                                        Pagrindinė
                                                    </div>
                                                )}

                                                {/* Actions overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                    {!image.isPrimary && (
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => handleSetPrimaryImage(image.id)}
                                                        >
                                                            <Star className="mr-1 h-3 w-3" />
                                                            Nustatyti kaip pagrindinę
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                                    <ImagePlus className="mb-4 h-12 w-12 opacity-50" />
                                    <p className="mb-1 text-sm font-medium">Nuotraukos dar neįkeltos</p>
                                    <p className="text-xs">Pridėkite nuotraukų, kad parodytumėte savo jachtą</p>
                                </div>
                            )}

                            <Separator />

                            {/* Upload New Images */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Įkelti naujas nuotraukas</h3>
                                <div className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="image-upload">Pasirinkti nuotraukas</Label>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            multiple
                                            onChange={(e) => setSelectedFiles(e.target.files)}
                                            className="mt-2"
                                        />
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            JPEG, PNG, JPG arba WebP. Maks. 5MB vienai nuotraukai. Galite pasirinkti kelias nuotraukas.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleImageUpload}
                                        disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
                                    >
                                        {uploading ? (
                                            <>Įkeliama...</>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Įkelti
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {selectedFiles && selectedFiles.length > 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        {selectedFiles.length} failas{selectedFiles.length > 1 ? 'ai' : ''} pasirinkta
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
