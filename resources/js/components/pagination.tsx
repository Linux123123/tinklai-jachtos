import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    links: PaginationLink[];
    total?: number;
    perPage?: number;
    onPageChange?: (url: string) => void;
}

export function Pagination({ currentPage, lastPage, links, total, perPage, onPageChange }: PaginationProps) {
    const handlePageChange = (url: string | null) => {
        if (!url) return;

        if (onPageChange) {
            onPageChange(url);
        } else {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    // Don't show pagination if there's only one page or no links
    if (lastPage <= 1 || !links || !Array.isArray(links)) {
        return null;
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
                {total && perPage && (
                    <p>
                        Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * perPage, total)}</span> of <span className="font-medium">{total}</span>{' '}
                        results
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button variant="outline" size="sm" onClick={() => handlePageChange(links[0]?.url)} disabled={!links[0]?.url}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                {/* Page Numbers */}
                <div className="hidden items-center gap-1 sm:flex">
                    {links.slice(1, -1).map((link, index) => {
                        // Parse the label to check if it's a page number or ellipsis
                        const isEllipsis = link.label === '...';
                        const pageNumber = parseInt(link.label);

                        if (isEllipsis) {
                            return (
                                <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
                                    ...
                                </span>
                            );
                        }

                        // Show first page, last page, current page, and pages around current
                        const showPage = pageNumber === 1 || pageNumber === lastPage || Math.abs(pageNumber - currentPage) <= 1;

                        if (!showPage) {
                            return null;
                        }

                        return (
                            <Button
                                key={link.label}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(link.url)}
                                disabled={link.active}
                                className="min-w-10"
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(links[links.length - 1]?.url)}
                    disabled={!links[links.length - 1]?.url}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
