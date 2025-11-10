import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { YachtImage } from '@/types/models';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

interface ImageGalleryProps {
    images: YachtImage[];
    title?: string;
    className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null && selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedIndex === null) return;

        switch (e.key) {
            case 'ArrowLeft':
                goToPrevious();
                break;
            case 'ArrowRight':
                goToNext();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    };

    if (images.length === 0) {
        return (
            <div className={cn('bg-muted flex aspect-video items-center justify-center rounded-lg', className)}>
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className={cn('grid gap-4', className)}>
                {/* Main Image */}
                <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img
                        src={images[0].url}
                        alt={title || 'Gallery image'}
                        className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                        onClick={() => openLightbox(0)}
                    />
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                        {images.slice(1, 7).map((image, index) => (
                            <div
                                key={image.id}
                                className="relative aspect-video cursor-pointer overflow-hidden rounded-md"
                                onClick={() => openLightbox(index + 1)}
                            >
                                <img
                                    src={image.url}
                                    alt={`${title} ${index + 2}`}
                                    className="h-full w-full object-cover transition-transform hover:scale-110"
                                />
                            </div>
                        ))}
                        {images.length > 7 && (
                            <div
                                className="bg-muted relative flex aspect-video cursor-pointer items-center justify-center rounded-md"
                                onClick={() => openLightbox(7)}
                            >
                                <span className="text-sm font-medium">+{images.length - 7}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
                <DialogContent className="max-w-7xl p-0" onKeyDown={(e) => handleKeyDown(e as any)}>
                    {selectedIndex !== null && (
                        <div className="relative">
                            {/* Close Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                                onClick={closeLightbox}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            {/* Navigation Buttons */}
                            {selectedIndex > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                    onClick={goToPrevious}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            )}

                            {selectedIndex < images.length - 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                    onClick={goToNext}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            )}

                            {/* Image */}
                            <div className="relative aspect-video w-full">
                                <img src={images[selectedIndex].url} alt={`${title} ${selectedIndex + 1}`} className="h-full w-full object-contain" />
                            </div>

                            {/* Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
