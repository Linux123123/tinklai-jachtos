import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, router } from '@inertiajs/react';
import { Shield, Ship, User } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    const handleQuickLogin = (email: string, password: string) => {
        router.post('/login', { email, password, remember: true });
    };

    return (
        <AuthLayout title="Prisijunkite prie savo paskyros" description="Įveskite savo el. paštą ir slaptažodį, kad prisijungtumėte">
            <Head title="Prisijungti" />

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">El. pašto adresas</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="el.pastas@pavyzdys.lt"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Slaptažodis</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Pamiršote slaptažodį?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Slaptažodis"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Prisiminti mane</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing} data-test="login-button">
                                {processing && <Spinner />}
                                Prisijungti
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-muted-foreground text-center text-sm">
                                Neturite paskyros?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Registruotis
                                </TextLink>
                            </div>
                        )}

                        {/* Quick Login Buttons for Development */}
                        <div className="mt-4">
                            <Separator className="my-4" />
                            <p className="text-muted-foreground mb-3 text-center text-xs">Greitas prisijungimas (testavimui)</p>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickLogin('aiste@client.com', 'password')}
                                    className="flex flex-col gap-1 py-3"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="text-xs">Klientas</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickLogin('jonas@yacht.com', 'password')}
                                    className="flex flex-col gap-1 py-3"
                                >
                                    <Ship className="h-4 w-4" />
                                    <span className="text-xs">Savininkas</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickLogin('admin@yacht.com', 'password')}
                                    className="flex flex-col gap-1 py-3"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span className="text-xs">Adminas</span>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
