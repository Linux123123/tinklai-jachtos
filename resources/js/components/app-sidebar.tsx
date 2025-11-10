import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type Auth, type NavItem, type Permission, type Role, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Calendar, LayoutGrid, MessageSquare, Sailboat, Users } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

/**
 * Check if user has a specific permission
 */
function userHasPermission(user: User | undefined, permissionName: string): boolean {
    if (!user?.permissions || !Array.isArray(user.permissions)) return false;
    return user.permissions.some((p: Permission) => p.name === permissionName);
}

/**
 * Check if user has a specific role
 */
function userHasRole(user: User | undefined, roleName: string): boolean {
    if (!user?.roles || !Array.isArray(user.roles)) return false;
    return user.roles.some((r: Role) => r.name === roleName);
}

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;

    // Generate navigation items based on user permissions and roles
    const mainNavItems: NavItem[] = useMemo(() => {
        const items: NavItem[] = [];

        // Client permissions (all authenticated users)
        items.push({
            title: 'Mano Rezevacijos',
            href: '/my-bookings',
            icon: Calendar,
        });

        items.push({
            title: 'Žinutės',
            href: '/messages',
            icon: MessageSquare,
        });

        // Owner permissions
        if (userHasRole(user, 'owner') || userHasRole(user, 'admin')) {
            items.push({
                title: 'Manos Jachtos',
                href: '/my-yachts',
                icon: Sailboat,
            });

            items.push({
                title: 'Savininko Rezervacijos',
                href: '/owner/bookings',
                icon: Calendar,
            });
        }

        // Admin permissions
        if (userHasRole(user, 'admin')) {
            items.push({
                title: 'Statistika',
                href: '/admin/statistics',
                icon: BarChart3,
            });

            items.push({
                title: 'Vartotojai',
                href: '/admin/users',
                icon: Users,
            });
        }

        return items;
    }, [user]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={'/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
