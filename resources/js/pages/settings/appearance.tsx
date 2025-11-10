import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Išvaizdos nustatymai',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <PublicLayout breadcrumbs={breadcrumbs}>
            <Head title="Išvaizdos nustatymai" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Išvaizdos nustatymai" description="Atnaujinkite savo paskyros išvaizdos nustatymus" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </PublicLayout>
    );
}
