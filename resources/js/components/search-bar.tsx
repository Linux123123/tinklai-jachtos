import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
    placeholder?: string;
    showFilters?: boolean;
    filters?: Array<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: Array<{ value: string; label: string }>;
    }>;
    className?: string;
}

export function SearchBar({
    searchValue,
    onSearchChange,
    onSearch,
    onReset,
    placeholder = 'Ieškoti...',
    showFilters = false,
    filters = [],
    className,
}: SearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className={className}>
            <div className="flex flex-col gap-4 md:flex-row">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    <Input
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9"
                    />
                </div>

                {/* Filter Selects */}
                {showFilters &&
                    filters.map((filter, index) => (
                        <div key={index} className="w-full md:w-48">
                            <Select value={filter.value} onValueChange={filter.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder={filter.label} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button onClick={onSearch} className="flex-1 md:flex-none">
                        <Search className="mr-2 h-4 w-4" />
                        Ieškoti
                    </Button>
                    <Button variant="outline" onClick={onReset} className="flex-1 md:flex-none">
                        <X className="mr-2 h-4 w-4" />
                        Atstatyti
                    </Button>
                </div>
            </div>
        </div>
    );
}
