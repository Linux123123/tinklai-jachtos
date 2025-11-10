# GitHub Copilot Instructions for Yacht Rental Portal

## Project Overview

This is a yacht rental portal built with Laravel (backend), React with TypeScript (frontend), and Inertia.js as the bridge between them. The system allows yacht owners to list their yachts for rent and clients to browse, book, and review yachts.

## Tech Stack

- **Backend**: Laravel 12.x
- **Frontend**: React 19+ with TypeScript
- **Bridge**: Inertia.js
- **Database**: MySQL/MariaDB
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: Laravel Inertia Form with Wayfinder
- **Real-time Communication**: Laravel Reverb
- **Code Formatting**: Laravel Pint (PHP), Prettier (TypeScript/React)
- **Type Safety**: TypeScript for all React components

## MCP Servers Available

- **Context7**: For fetching up-to-date Laravel documentation
    - Use library ID: `/websites/laravel` or `/websites/laravel-12.x`
- **Context7**: For fetching Inertia.js documentation
    - Use library ID: `/inertiajs/inertia` or `/llmstxt/inertiajs_llms_txt`
- **Context7**: For fetching shadcn/ui documentation
    - Use library ID: `/shadcn-ui/ui` or `/websites/ui_shadcn`

## User Roles & Permissions

1. **Client (Renter)**: Browse yachts, make bookings, send messages, leave reviews
2. **Owner**: All client permissions + list yachts, manage pricing, handle bookings
3. **Admin**: Full system access, user management, view statistics

## Code Standards

### TypeScript/React

- **Always use TypeScript** - No JSX files, only TSX
- Use functional components with hooks
- Use proper TypeScript interfaces for all props and data structures
- Use shadcn/ui components for all UI elements
- Follow React best practices and hooks patterns
- Use Inertia.js types for page props and forms
- Prefer named exports for components
- Use absolute imports with `@/` prefix for components and utilities

### Laravel/PHP

- Follow PSR-12 coding standards
- Use Laravel Pint for code formatting
- Use Eloquent ORM for database operations
- Implement proper validation in FormRequest classes
- Use Resource classes for API responses to Inertia
- Follow Laravel best practices for controllers (keep them thin)
- Use dependency injection
- Implement proper authorization with policies

### Database

- Use migrations for all database changes
- Follow Laravel naming conventions for tables and columns
- Use proper foreign key constraints
- Index frequently queried columns
- Use Eloquent relationships properly

### Forms

- Use Laravel Inertia Form helper with Wayfinder for form handling
- Implement proper validation on both frontend and backend
- Use FormRequest classes for complex validation logic
- Display validation errors using shadcn/ui components

### Real-time Features

- Use Laravel Reverb for WebSocket connections
- Implement proper event broadcasting for messages
- Use Laravel Echo on the frontend
- Handle connection states gracefully

## File Organization

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── YachtController.php
│   │   ├── BookingController.php
│   │   ├── Owner/
│   │   │   └── YachtController.php
│   │   └── Admin/
│   │       └── DashboardController.php
│   ├── Requests/
│   │   ├── StoreYachtRequest.php
│   │   └── StoreBookingRequest.php
│   └── Resources/
│       ├── YachtResource.php
│       └── BookingResource.php
├── Models/
│   ├── User.php
│   ├── Yacht.php
│   ├── Booking.php
│   └── Review.php
└── Policies/
    ├── YachtPolicy.php
    └── BookingPolicy.php
```

### Frontend (React/TypeScript)

```
resources/js/
├── Pages/
│   ├── Home.tsx
│   ├── Yachts/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   ├── Dashboard/
│   │   ├── MyBookings.tsx
│   │   └── Owner/
│   │       ├── MyYachts.tsx
│   │       └── YachtForm.tsx
│   └── Admin/
│       └── Dashboard.tsx
├── Components/
│   ├── ui/ (shadcn components)
│   ├── YachtCard.tsx
│   ├── BookingForm.tsx
│   └── ReviewList.tsx
├── Layouts/
│   ├── AppLayout.tsx
│   └── GuestLayout.tsx
├── types/
│   ├── index.d.ts
│   └── models.d.ts
└── lib/
    └── utils.ts
```

## Naming Conventions

- **Components**: PascalCase (e.g., `YachtCard.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables/Functions**: camelCase
- **Interfaces/Types**: PascalCase with descriptive names
- **Database Tables**: snake_case, plural (e.g., `yacht_images`)
- **Model Properties**: snake_case in database, camelCase in TypeScript interfaces

## Key Features to Implement

1. Yacht listing and search functionality
2. Booking system with date validation
3. Seasonal pricing management (per week)
4. Messaging system between clients and owners
5. Review and rating system
6. Admin dashboard with top 5 renters statistics
7. Image upload and gallery for yachts
8. User authentication and authorization

## Performance Considerations

- Use Inertia's lazy loading for heavy data
- Implement pagination for large lists
- Optimize images (use Laravel's image intervention)
- Use database indexing appropriately
- Cache frequently accessed data

## Security

- Validate all user inputs
- Use Laravel's CSRF protection
- Implement proper authorization checks
- Sanitize user-generated content
- Use prepared statements (Eloquent does this automatically)
- Hash passwords with bcrypt
- Implement rate limiting for APIs

## Testing

- Write feature tests for critical user flows
- Use Pest PHP for testing
- Test authorization policies
- Test form validations
- Test booking date conflicts

## When to Use MCP Servers

- Fetch Laravel documentation when implementing Laravel-specific features
- Fetch Inertia.js documentation for SSR, forms, and data handling patterns
- Fetch shadcn/ui documentation for component usage and customization
- Always check documentation for best practices before implementing complex features
