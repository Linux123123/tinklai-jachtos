import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function PublicLayout({ children, breadcrumbs, ...props }: PublicLayoutProps) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppHeaderLayout>
    );
}
