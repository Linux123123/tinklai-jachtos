<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Booking;
use App\Models\Review;
use App\Models\User;
use App\Models\Yacht;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics.
     */
    public function index(): Response
    {
        // Get top 5 yacht owners by average rating
        $topOwners = User::query()
            ->select('users.id', 'users.name', 'users.email')
            ->selectRaw('AVG(reviews.rating) as average_rating')
            ->selectRaw('COUNT(reviews.id) as total_reviews')
            ->join('yachts', 'users.id', '=', 'yachts.user_id')
            ->join('bookings', 'yachts.id', '=', 'bookings.yacht_id')
            ->join('reviews', 'bookings.id', '=', 'reviews.booking_id')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->having('total_reviews', '>=', 1) // At least 1 review
            ->orderByDesc('average_rating')
            ->limit(5)
            ->get()
            ->map(function ($owner) {
                return [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                    'averageRating' => round($owner->average_rating, 2),
                    'totalReviews' => $owner->total_reviews,
                ];
            });

        // General statistics
        $statistics = [
            'totalYachts' => Yacht::count(),
            'activeYachts' => Yacht::where('status', 'available')->count(),
            'totalUsers' => User::count(),
            'totalBookings' => Booking::count(),
            'pendingBookings' => Booking::where('status', 'pending')->count(),
            'confirmedBookings' => Booking::where('status', 'confirmed')->count(),
            'completedBookings' => Booking::where('status', 'completed')->count(),
            'totalReviews' => Review::count(),
            'averageRating' => round(Review::avg('rating') ?? 0, 2),
            'totalRevenue' => Booking::whereIn('status', ['confirmed', 'completed'])
                ->sum('total_price'),
        ];

        // Recent bookings
        $recentBookings = Booking::query()
            ->with(['user', 'yacht.primaryImage'])
            ->latest()
            ->limit(10)
            ->get();

        // Booking trends (last 12 months)
        $bookingTrends = Booking::query()
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('admin/dashboard', [
            'topOwners' => $topOwners,
            'statistics' => $statistics,
            'recentBookings' => $recentBookings,
            'bookingTrends' => $bookingTrends,
        ]);
    }

    /**
     * Display user management page.
     */
    public function users(): Response
    {
        $users = User::query()
            ->withCount(['yachts', 'bookings', 'reviews'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/users', [
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Display statistics page.
     */
    public function statistics(): Response
    {
        // Yacht statistics by type
        $yachtsByType = Yacht::query()
            ->select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->get();

        // Bookings by status
        $bookingsByStatus = Booking::query()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Revenue by month (last 12 months)
        $revenueByMonth = Booking::query()
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->whereIn('status', ['confirmed', 'completed'])
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top yachts by bookings
        $topYachts = Yacht::query()
            ->withCount('bookings')
            ->with('primaryImage')
            ->orderByDesc('bookings_count')
            ->limit(10)
            ->get();

        return Inertia::render('admin/statistics', [
            'yachtsByType' => $yachtsByType,
            'bookingsByStatus' => $bookingsByStatus,
            'revenueByMonth' => $revenueByMonth,
            'topYachts' => $topYachts,
        ]);
    }
}
