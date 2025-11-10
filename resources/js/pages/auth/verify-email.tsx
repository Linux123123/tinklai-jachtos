// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout title="Patvirtinti el. paštą" description="Prašome patvirtinti savo el. pašto adresą paspaudę nuorodą, kurią jums išsiuntėme.">
            <Head title="El. pašto patvirtinimas" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Nauja patvirtinimo nuoroda išsiųsta į el. pašto adresą, kurį nurodėte registracijos metu.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Siųsti patvirtinimo el. laišką iš naujo
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            Atsijungti
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
