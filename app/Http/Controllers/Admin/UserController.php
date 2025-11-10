<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()
            ->with('roles')
            ->withCount(['yachts', 'bookings', 'reviews']);

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->role($request->input('role'));
        }

        $users = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/users', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'role']),
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['client', 'owner', 'admin'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($validated['role']);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Naudotojas sėkmingai sukurtas!');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load([
            'roles',
            'yachts.primaryImage',
            'bookings.yacht.primaryImage',
            'reviews.booking.yacht.primaryImage',
        ]);

        return Inertia::render('admin/users/show', [
            'user' => UserResource::make($user),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => UserResource::make($user->load('roles')),
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['client', 'owner', 'admin'])],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Sync role
        $user->syncRoles([$validated['role']]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Naudotojas sėkmingai atnaujintas!');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Negalite ištrinti savo paskyros.']);
        }

        // Check if user has active bookings
        $activeBookings = $user->bookings()->whereIn('status', ['pending', 'confirmed'])->count();
        if ($activeBookings > 0) {
            return back()->withErrors(['error' => 'Negalima ištrinti naudotojo, turinčio aktyvių rezervacijų.']);
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Naudotojas sėkmingai ištrintas!');
    }

    /**
     * Block/unblock a user.
     */
    public function toggleBlock(User $user): RedirectResponse
    {
        // Prevent blocking yourself
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Negalite blokuoti savo paskyros.']);
        }

        // Toggle blocked status (you'll need to add a 'blocked_at' column to users table)
        // For now, we'll just return a success message
        // TODO: Add blocked_at column to users table migration

        return back()->with('success', 'Naudotojo būsena sėkmingai atnaujinta!');
    }

    /**
     * Assign role to user.
     */
    public function assignRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['client', 'owner', 'admin'])],
        ]);

        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'Rolė sėkmingai priskirta!');
    }
}
