import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dviejų veiksnių autentifikavimas',
        href: show.url(),
    },
];

export default function TwoFactor({ requiresConfirmation = false, twoFactorEnabled = false }: TwoFactorProps) {
    const { qrCodeSvg, hasSetupData, manualSetupKey, clearSetupData, fetchSetupData, recoveryCodesList, fetchRecoveryCodes, errors } =
        useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <PublicLayout breadcrumbs={breadcrumbs}>
            <Head title="Dviejų veiksnių autentifikavimas" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Dviejų veiksnių autentifikavimas" description="Valdykite dviejų veiksnių autentifikavimo nustatymus" />
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge variant="default">Įjungta</Badge>
                            <p className="text-muted-foreground">
                                Kai dviejų veiksnių autentifikavimas įjungtas, prisijungimo metu būsite paraginti įvesti saugų atsitiktinį PIN kodą, kurį galite gauti iš TOTP palaikančios programos savo telefone.
                            </p>

                            <TwoFactorRecoveryCodes recoveryCodesList={recoveryCodesList} fetchRecoveryCodes={fetchRecoveryCodes} errors={errors} />

                            <div className="relative inline">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button variant="destructive" type="submit" disabled={processing}>
                                            <ShieldBan /> Išjungti 2FA
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge variant="destructive">Išjungta</Badge>
                            <p className="text-muted-foreground">
                                Kai įjungsite dviejų veiksnių autentifikavimą, prisijungimo metu būsite paraginti įvesti saugų PIN kodą. Šį PIN kodą galite gauti iš TOTP palaikančios programos savo telefone.
                            </p>

                            <div>
                                {hasSetupData ? (
                                    <Button onClick={() => setShowSetupModal(true)}>
                                        <ShieldCheck />
                                        Tęsti sąranką
                                    </Button>
                                ) : (
                                    <Form {...enable.form()} onSuccess={() => setShowSetupModal(true)}>
                                        {({ processing }) => (
                                            <Button type="submit" disabled={processing}>
                                                <ShieldCheck />
                                                Įjungti 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </PublicLayout>
    );
}
