import { store } from '@/actions/App/Http/Controllers/Owner/YachtController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';

export default function CreateYacht() {
    return (
        <AppLayout>
            <Head title="Paskelbti naują jachtą" />

            <div className="container mx-auto max-w-3xl py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Paskelbti naują jachtą</CardTitle>
                        <CardDescription>Užpildykite duomenis, kad paskelbti jachtą nuomai</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...store.form()} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Pavadinimas *</Label>
                                        <Input id="title" name="title" required placeholder="pvz., Prabangus vandenyno kruizeris" />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Aprašymas *</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            required
                                            rows={5}
                                            placeholder="Aprašykite savo jachtą, jos funkcijas ir kas daro ją ypatingą..."
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipas *</Label>
                                        <Select name="type" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pasirinkti jachtos tipą" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sailboat">Burinis laivas</SelectItem>
                                                <SelectItem value="motorboat">Motorinis laivas</SelectItem>
                                                <SelectItem value="catamaran">Katamaranas</SelectItem>
                                                <SelectItem value="yacht">Jachta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.type} />
                                    </div>

                                    {/* Capacity */}
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Talpa (svečių skaičius) *</Label>
                                        <Input id="capacity" name="capacity" type="number" min="1" max="100" required placeholder="pvz., 8" />
                                        <InputError message={errors.capacity} />
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Vieta *</Label>
                                        <Input id="location" name="location" required placeholder="pvz., Klaipėda" />
                                        <InputError message={errors.location} />
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Būsena *</Label>
                                        <Select name="status" required defaultValue="available">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pasirinkti būseną" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Prieinama</SelectItem>
                                                <SelectItem value="unavailable">Neprieinama</SelectItem>
                                                <SelectItem value="maintenance">Priežiūra</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-2">
                                        <Label htmlFor="images">Nuotraukos (maks. 10, po 5MB kiekviena)</Label>
                                        <Input id="images" name="images[]" type="file" accept="image/*" multiple />
                                        <p className="text-muted-foreground text-sm">
                                            Įkelkite iki 10 jachtos nuotraukų. Pirmoji nuotrauka bus pagrindinė.
                                        </p>
                                        <InputError message={errors.images} />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner className="mr-2" />}
                                            Paskelbti jachtą
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                            Atšaukti
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
