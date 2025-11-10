import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types/models';
import { Head, router, useForm } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { Anchor, Calendar, MoreVertical, Star, Trash2, UserCog } from 'lucide-react';
import { useState } from 'react';

interface AdminUsersProps {
    users: {
        data: User[];
    };
    roles: string[];
}

export default function AdminUsers({ users, roles }: AdminUsersProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleDialog, setShowRoleDialog] = useState(false);

    const { data, setData, post, processing } = useForm({
        role: '',
    });

    const handleDelete = (userId: number) => {
        if (confirm('Ar tikrai norite ištrinti šį naudotoją? Šio veiksmo negalima atšaukti.')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const handleRoleChange = (user: User) => {
        setSelectedUser(user);
        setData('role', user.roles?.[0]?.name || 'client');
        setShowRoleDialog(true);
    };

    const submitRoleChange = () => {
        if (selectedUser) {
            post(`/admin/users/${selectedUser.id}/assign-role`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowRoleDialog(false);
                    setSelectedUser(null);
                },
            });
        }
    };
    return (
        <AppLayout>
            <Head title="Naudotojų valdymas" />

            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Naudotojų valdymas</h1>
                    <p className="text-muted-foreground mt-1">Valdykite sistemos naudotojus ir jų roles</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Visi naudotojai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.data.map((user) => (
                                <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <span className="text-lg font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-muted-foreground text-sm">{user.email}</p>
                                            {user.createdAt && (
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    Prisijungė {formatDate(new Date(user.createdAt), 'MMM d, yyyy')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="text-muted-foreground flex items-center gap-1">
                                                <Anchor className="h-4 w-4" />
                                                <span className="text-sm font-medium">{(user as any).yachtsCount || 0}</span>
                                            </div>
                                            <p className="text-muted-foreground text-xs">Jachtos</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm font-medium">{(user as any).bookingsCount || 0}</span>
                                            </div>
                                            <p className="text-muted-foreground text-xs">Rezervacijos</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-muted-foreground flex items-center gap-1">
                                                <Star className="h-4 w-4" />
                                                <span className="text-sm font-medium">{(user as any).reviewsCount || 0}</span>
                                            </div>
                                            <p className="text-muted-foreground text-xs">Atsiliepimai</p>
                                        </div>

                                        <Badge variant="secondary">{user.roles?.[0]?.name || 'Naudotojas'}</Badge>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Veiksmai</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleRoleChange(user)}>
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    Keisti rolę
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Ištrinti naudotoją
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Role Change Dialog */}
                {showRoleDialog && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Keisti naudotojo rolę</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium">Naudotojas: {selectedUser.name}</p>
                                        <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Pasirinkti rolę</label>
                                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Pasirinkite rolę" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                                            Atšaukti
                                        </Button>
                                        <Button onClick={submitRoleChange} disabled={processing}>
                                            Išsaugoti pakeitimus
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
