import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    className?: string;
}

export function StarRating({ rating, maxRating = 5, size = 'md', showValue = false, onChange, readonly = false, className }: StarRatingProps) {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const handleClick = (value: number) => {
        if (!readonly && onChange) {
            onChange(value);
        }
    };

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleClick(value)}
                    disabled={readonly}
                    className={cn('transition-transform', !readonly && onChange && 'cursor-pointer hover:scale-110', readonly && 'cursor-default')}
                    aria-label={`Rate ${value} out of ${maxRating}`}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
                            !readonly && onChange && value <= rating && 'drop-shadow-sm',
                        )}
                    />
                </button>
            ))}
            {showValue && <span className={cn('ml-1 font-medium', textSizeClasses[size])}>{rating.toFixed(1)}</span>}
        </div>
    );
}
