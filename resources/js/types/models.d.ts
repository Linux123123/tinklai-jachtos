/**
 * TypeScript interfaces for Laravel models
 * These interfaces match the Laravel Eloquent models with camelCase property names
 */

/**
 * Base timestamps interface for Laravel models
 */
export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

/**
 * User model interface
 */
export interface User extends Timestamps {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;

    // Two-factor authentication fields
    twoFactorSecret: string | null;
    twoFactorRecoveryCodes: string | null;
    twoFactorConfirmedAt: string | null;

    // Relationships (optional - loaded when eager loaded)
    yachts?: Yacht[];
    bookings?: Booking[];
    reviews?: Review[];
    receivedReviews?: Review[];
    conversationsAsParticipantOne?: Conversation[];
    conversationsAsParticipantTwo?: Conversation[];
    messages?: Message[];

    // Spatie Permission fields (will be added when configured)
    roles?: Role[];
    permissions?: Permission[];
}

/**
 * Role model interface (Spatie Permission)
 */
export interface Role {
    id: number;
    name: string;
    guardName: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Permission model interface (Spatie Permission)
 */
export interface Permission {
    id: number;
    name: string;
    guardName: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Yacht model interface
 */
export interface Yacht extends Timestamps {
    id: number;
    userId: number;
    title: string;
    description: string;
    type: string; // sailboat, motorboat, catamaran, etc.
    capacity: number;
    location: string;
    status: 'available' | 'unavailable' | 'maintenance';

    // Relationships (optional - loaded when eager loaded)
    owner?: User;
    images?: YachtImage[];
    primaryImage?: YachtImage;
    pricings?: Pricing[];
    bookings?: Booking[];
    reviews?: Review[];

    // Computed properties (if added via appends in Resource)
    averageRating?: number;
    reviewsCount?: number;
}

/**
 * Yacht Image model interface
 */
export interface YachtImage extends Timestamps {
    id: number;
    yachtId: number;
    path: string;
    isPrimary: boolean;

    // Relationships
    yacht?: Yacht;

    // Computed properties
    url?: string; // Full URL to the image
}

/**
 * Pricing model interface (seasonal pricing per week)
 */
export interface Pricing extends Timestamps {
    id: number;
    yachtId: number;
    startDate: string; // YYYY-MM-DD format
    endDate: string; // YYYY-MM-DD format
    pricePerWeek: string; // Decimal as string for precision

    // Relationships
    yacht?: Yacht;

    // Computed properties
    pricePerWeekFormatted?: string; // e.g., "$1,234.56"
}

/**
 * Booking model interface
 */
export interface Booking extends Timestamps {
    id: number;
    userId: number;
    yachtId: number;
    startDate: string; // YYYY-MM-DD format
    endDate: string; // YYYY-MM-DD format
    totalPrice: string; // Decimal as string for precision
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

    // Relationships
    user?: User;
    yacht?: Yacht;
    review?: Review;

    // Computed properties
    totalPriceFormatted?: string;
    durationDays?: number;
    durationWeeks?: number;
    canBeCancelled?: boolean;
    canBeReviewed?: boolean;
}

/**
 * Review model interface
 */
export interface Review extends Timestamps {
    id: number;
    bookingId: number;
    userId: number;
    ownerId: number;
    yachtId: number;
    rating: number; // 1-5
    comment: string | null;

    // Relationships
    booking?: Booking;
    user?: User;
    owner?: User;
    yacht?: Yacht;
}

/**
 * Conversation model interface
 */
export interface Conversation extends Timestamps {
    id: number;
    participantOneId: number;
    participantTwoId: number;

    // Relationships
    participantOne?: User;
    participantTwo?: User;
    messages?: Message[];
    latestMessage?: Message;

    // Computed properties
    unreadCount?: number;
    otherParticipant?: User; // The participant who is not the current user
}

/**
 * Message model interface
 */
export interface Message extends Timestamps {
    id: number;
    conversationId: number;
    senderId: number;
    body: string;
    readAt: string | null;

    // Relationships
    conversation?: Conversation;
    sender?: User;

    // Computed properties
    isRead?: boolean;
    isSentByCurrentUser?: boolean;
}

/**
 * Pagination meta interface
 */
export interface PaginationMeta {
    currentPage: number;
    from: number | null;
    lastPage: number;
    perPage: number;
    to: number | null;
    total: number;
}

/**
 * Pagination links interface
 */
export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

/**
 * Common page props from Inertia
 */
export interface PageProps {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    errors?: Record<string, string>;
    [key: string]: any;
}

/**
 * Form errors type
 */
export type FormErrors = Record<string, string>;

/**
 * Yacht search/filter params
 */
export interface YachtSearchParams {
    search?: string;
    type?: string;
    location?: string;
    minCapacity?: number;
    maxCapacity?: number;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    perPage?: number;
    sortBy?: 'created_at' | 'price' | 'rating' | 'title';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Booking search/filter params
 */
export interface BookingSearchParams {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    startDate?: string;
    endDate?: string;
    page?: number;
    perPage?: number;
}

/**
 * Statistics for admin dashboard
 */
export interface AdminStatistics {
    totalUsers: number;
    totalYachts: number;
    totalBookings: number;
    totalRevenue: string;
    topRenters: Array<{
        user: User;
        averageRating: number;
        totalBookings: number;
        totalSpent: string;
    }>;
    recentBookings: Booking[];
    recentReviews: Review[];
}
