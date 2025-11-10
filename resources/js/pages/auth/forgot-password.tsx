// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Pamiršote slaptažodį" description="Įveskite savo el. paštą, kad gautumėte slaptažodžio atkūrimo nuorodą">
            <Head title="Pamiršote slaptažodį" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">El. pašto adresas</Label>
                                <Input id="email" type="email" name="email" autoComplete="off" autoFocus placeholder="el.pastas@example.com" />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button className="w-full" disabled={processing} data-test="email-password-reset-link-button">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Siųsti slaptažodžio atkūrimo nuorodą
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Arba grįžti į</span>
                    <TextLink href={login()}>prisijungimą</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
