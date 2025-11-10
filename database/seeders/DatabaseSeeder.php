<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Pricing;
use App\Models\Review;
use App\Models\User;
use App\Models\Yacht;
use App\Models\YachtImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolePermissionSeeder::class);

        $this->command->info('🌊 Creating yacht rental portal data...');

        // Create admin
        $this->command->info('👤 Creating admin user...');
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@yacht.com',
            'password' => 'password',
        ]);
        $admin->assignRole(Role::ADMIN->value);

        // Create yacht owners
        $this->command->info('👥 Creating yacht owners...');
        $owners = [
            ['name' => 'John Smith', 'email' => 'john@yacht.com'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah@yacht.com'],
            ['name' => 'Michael Brown', 'email' => 'michael@yacht.com'],
            ['name' => 'Emma Wilson', 'email' => 'emma@yacht.com'],
            ['name' => 'David Miller', 'email' => 'david@yacht.com'],
        ];

        $ownerUsers = [];
        foreach ($owners as $ownerData) {
            $owner = User::create([
                'name' => $ownerData['name'],
                'email' => $ownerData['email'],
                'password' => 'password',
            ]);
            $owner->assignRole(Role::OWNER->value);
            $ownerUsers[] = $owner;
        }

        // Create clients
        $this->command->info('👥 Creating client users...');
        $clients = [
            ['name' => 'Alice Cooper', 'email' => 'alice@client.com'],
            ['name' => 'Bob Taylor', 'email' => 'bob@client.com'],
            ['name' => 'Carol White', 'email' => 'carol@client.com'],
            ['name' => 'Daniel Harris', 'email' => 'daniel@client.com'],
            ['name' => 'Eve Martinez', 'email' => 'eve@client.com'],
            ['name' => 'Frank Garcia', 'email' => 'frank@client.com'],
            ['name' => 'Grace Lee', 'email' => 'grace@client.com'],
            ['name' => 'Henry Clark', 'email' => 'henry@client.com'],
        ];

        $clientUsers = [];
        foreach ($clients as $clientData) {
            $client = User::create([
                'name' => $clientData['name'],
                'email' => $clientData['email'],
                'password' => 'password',
            ]);
            $client->assignRole(Role::CLIENT->value);
            $clientUsers[] = $client;
        }

        // Yacht data
        $yachtsData = [
            [
                'title' => 'Ocean Dream',
                'description' => 'Luxurious sailing yacht perfect for romantic getaways. Features a spacious deck, comfortable cabins, and modern amenities. Enjoy breathtaking sunsets and peaceful sailing experiences.',
                'type' => 'sailboat',
                'capacity' => 6,
                'location' => 'Miami, Florida',
                'query' => 'luxury sailing yacht',
            ],
            [
                'title' => 'Sea Breeze',
                'description' => 'Modern motor yacht with powerful engines and sleek design. Ideal for speed enthusiasts and island hopping adventures. Equipped with state-of-the-art navigation systems.',
                'type' => 'motorboat',
                'capacity' => 8,
                'location' => 'San Diego, California',
                'query' => 'motor yacht ocean',
            ],
            [
                'title' => 'Paradise Catamaran',
                'description' => 'Spacious catamaran offering stability and comfort for families. Multiple levels, large lounge areas, and excellent fishing spots. Perfect for group celebrations.',
                'type' => 'catamaran',
                'capacity' => 12,
                'location' => 'Key West, Florida',
                'query' => 'catamaran sailing',
            ],
            [
                'title' => 'Azure Lady',
                'description' => 'Elegant yacht with premium finishes and luxury accommodations. Professional crew available. Ideal for corporate events and special occasions.',
                'type' => 'yacht',
                'capacity' => 10,
                'location' => 'Newport Beach, California',
                'query' => 'luxury yacht deck',
            ],
            [
                'title' => 'Wind Dancer',
                'description' => 'Classic sailing yacht combining traditional charm with modern comfort. Perfect for sailing purists who appreciate authentic maritime experiences.',
                'type' => 'sailboat',
                'capacity' => 4,
                'location' => 'Charleston, South Carolina',
                'query' => 'classic sailboat',
            ],
            [
                'title' => 'Thunder Wave',
                'description' => 'High-performance motor yacht for thrill-seekers. Equipped with water sports equipment including jet skis and wakeboard. Entertainment system included.',
                'type' => 'motorboat',
                'capacity' => 6,
                'location' => 'Miami Beach, Florida',
                'query' => 'speed boat yacht',
            ],
            [
                'title' => 'Serenity Now',
                'description' => 'Peaceful catamaran perfect for meditation retreats and yoga sessions on water. Eco-friendly design with solar panels and sustainable features.',
                'type' => 'catamaran',
                'capacity' => 8,
                'location' => 'Honolulu, Hawaii',
                'query' => 'catamaran sunset',
            ],
            [
                'title' => 'Royal Voyager',
                'description' => 'Majestic mega yacht with helicopter pad and multiple decks. Cinema room, gym, and spa facilities. Ultimate luxury experience on water.',
                'type' => 'yacht',
                'capacity' => 16,
                'location' => 'Fort Lauderdale, Florida',
                'query' => 'mega yacht luxury',
            ],
            [
                'title' => 'Coastal Cruiser',
                'description' => 'Versatile motor yacht perfect for coastal exploration and fishing trips. Well-equipped galley and comfortable sleeping quarters.',
                'type' => 'motorboat',
                'capacity' => 5,
                'location' => 'Seattle, Washington',
                'query' => 'fishing yacht',
            ],
            [
                'title' => 'Sunset Paradise',
                'description' => 'Beautiful sailing yacht with panoramic views and spacious deck. Ideal for photographers and sunset enthusiasts. Romantic ambiance guaranteed.',
                'type' => 'sailboat',
                'capacity' => 7,
                'location' => 'Santa Barbara, California',
                'query' => 'sailboat sunset ocean',
            ],
        ];

        // Create yachts with images
        $this->command->info('⛵ Creating yachts with real images...');
        $yachts = [];
        foreach ($yachtsData as $index => $yachtData) {
            $owner = $ownerUsers[$index % count($ownerUsers)];

            $yacht = Yacht::create([
                'user_id' => $owner->id,
                'title' => $yachtData['title'],
                'description' => $yachtData['description'],
                'type' => $yachtData['type'],
                'capacity' => $yachtData['capacity'],
                'location' => $yachtData['location'],
                'status' => 'available',
            ]);

            // Download and save yacht images from Pexels
            $this->downloadYachtImages($yacht, $yachtData['query']);

            // Add seasonal pricing (3-4 pricing periods per yacht)
            $this->createPricing($yacht);

            $yachts[] = $yacht;
            $this->command->info("  ✓ Created: {$yacht->title}");
        }

        // Create bookings (past completed ones for reviews)
        $this->command->info('📅 Creating bookings...');
        $bookings = [];
        foreach ($yachts as $yacht) {
            // Create 4-8 completed bookings for each yacht (for reviews)
            $reviewCount = rand(4, 8);
            for ($i = 0; $i < $reviewCount; $i++) {
                $client = $clientUsers[array_rand($clientUsers)];

                // Create past bookings (30-180 days ago)
                $daysAgo = rand(30, 180);
                $startDate = now()->subDays($daysAgo + 14);
                $endDate = now()->subDays($daysAgo);

                $weeks = ceil($startDate->diffInDays($endDate) / 7);
                $pricePerWeek = rand(1500, 5000);

                $booking = Booking::create([
                    'user_id' => $client->id,
                    'yacht_id' => $yacht->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'total_price' => $pricePerWeek * $weeks,
                    'status' => 'completed',
                ]);

                $bookings[] = $booking;
            }

            // Create some future/pending bookings
            for ($i = 0; $i < rand(1, 3); $i++) {
                $client = $clientUsers[array_rand($clientUsers)];
                $daysInFuture = rand(7, 60);
                $startDate = now()->addDays($daysInFuture);
                $endDate = now()->addDays($daysInFuture + rand(7, 21));

                $weeks = ceil($startDate->diffInDays($endDate) / 7);
                $pricePerWeek = rand(1500, 5000);

                $booking = Booking::create([
                    'user_id' => $client->id,
                    'yacht_id' => $yacht->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'total_price' => $pricePerWeek * $weeks,
                    'status' => rand(0, 1) ? 'confirmed' : 'pending',
                ]);
            }
        }

        // Create reviews for completed bookings
        $this->command->info('⭐ Creating reviews...');
        $reviewComments = [
            'Amazing experience! The yacht was in perfect condition and the owner was very helpful.',
            'Absolutely loved it! Would definitely book again. The sunset views were spectacular.',
            'Great yacht, smooth sailing. Had an unforgettable time with family.',
            'Perfect for our anniversary celebration. Everything was as described.',
            'The yacht exceeded our expectations. Professional service and beautiful vessel.',
            'Wonderful week on the water. The yacht was clean, well-maintained, and a joy to sail.',
            'Outstanding experience! The owner provided excellent recommendations for routes.',
            'Best vacation ever! The yacht was luxurious and comfortable.',
            'Highly recommend this yacht. Great value for money and fantastic memories.',
            'Incredible time! The yacht was perfect for our group and very spacious.',
            'Fantastic yacht with all the amenities we needed. Owner was responsive and friendly.',
            'Beautiful yacht, smooth booking process. Will definitely return!',
        ];

        foreach ($bookings as $booking) {
            $reviewDate = \Carbon\Carbon::parse($booking->end_date)->addDays(rand(1, 7));

            Review::create([
                'booking_id' => $booking->id,
                'rating' => rand(4, 5), // Mostly positive reviews
                'comment' => $reviewComments[array_rand($reviewComments)],
                'created_at' => $reviewDate,
            ]);
        }

        // Create conversations and messages
        $this->command->info('💬 Creating messages...');
        $messageTemplates = [
            'Hi! I\'m interested in booking your yacht. Is it available for next month?',
            'Hello! Could you provide more details about the amenities included?',
            'Thank you for the wonderful experience! The yacht was perfect.',
            'I have a question about the check-in process. What time can we board?',
            'Is there a captain included or do we need to hire one separately?',
            'Can you accommodate dietary restrictions for the catering service?',
            'What\'s the cancellation policy for bookings?',
            'I\'d like to extend my booking by a few days. Is that possible?',
        ];

        $ownerResponses = [
            'Thank you for your interest! Yes, the yacht is available. I\'ll send you more details.',
            'Of course! The yacht includes all standard amenities plus water sports equipment.',
            'Thank you so much! It was a pleasure hosting you.',
            'You can board anytime after 2 PM. I\'ll be there to show you around.',
            'A professional captain is included in the price for your safety and convenience.',
            'Absolutely! We can accommodate any dietary needs. Just let us know in advance.',
            'You can cancel up to 14 days before for a full refund.',
            'I\'d be happy to accommodate that! Let me check the schedule.',
        ];

        foreach ($ownerUsers as $owner) {
            // Create 2-4 conversations per owner
            $ownerYachts = Yacht::where('user_id', $owner->id)->get();

            $conversationsCreated = 0;
            $maxAttempts = 10; // Prevent infinite loop
            $attempts = 0;

            while ($conversationsCreated < rand(2, 4) && $attempts < $maxAttempts) {
                $attempts++;
                $client = $clientUsers[array_rand($clientUsers)];

                // Check if conversation already exists between these users
                $existingConversation = Conversation::where(function ($query) use ($client, $owner) {
                    $query->where('participant_one_id', $client->id)
                        ->where('participant_two_id', $owner->id);
                })->orWhere(function ($query) use ($client, $owner) {
                    $query->where('participant_one_id', $owner->id)
                        ->where('participant_two_id', $client->id);
                })->first();

                if ($existingConversation) {
                    continue; // Skip if conversation already exists
                }

                $conversation = Conversation::create([
                    'participant_one_id' => $client->id,
                    'participant_two_id' => $owner->id,
                ]);

                $conversationsCreated++;

                // Create 2-6 messages in the conversation
                for ($j = 0; $j < rand(2, 6); $j++) {
                    $isClientMessage = $j % 2 === 0;

                    Message::create([
                        'conversation_id' => $conversation->id,
                        'sender_id' => $isClientMessage ? $client->id : $owner->id,
                        'body' => $isClientMessage
                            ? $messageTemplates[array_rand($messageTemplates)]
                            : $ownerResponses[array_rand($ownerResponses)],
                        'created_at' => now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        }

        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->info('📊 Summary:');
        $this->command->info('   - Users: ' . User::count());
        $this->command->info('   - Yachts: ' . Yacht::count());
        $this->command->info('   - Bookings: ' . Booking::count());
        $this->command->info('   - Reviews: ' . Review::count());
        $this->command->info('   - Messages: ' . Message::count());
    }

    /**
     * Download yacht images from Pexels API.
     */
    private function downloadYachtImages(Yacht $yacht, string $query): void
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => config('services.pexels.api_key'),
            ])->get('https://api.pexels.com/v1/search', [
                        'query' => $query,
                        'per_page' => 6,
                        'orientation' => 'landscape',
                    ]);

            if ($response->successful()) {
                $photos = $response->json()['photos'];
                $imageCount = min(count($photos), rand(4, 6));

                for ($i = 0; $i < $imageCount; $i++) {
                    $photo = $photos[$i];
                    $imageUrl = $photo['src']['large2x'];

                    // Download image
                    $imageContent = Http::get($imageUrl)->body();

                    // Generate unique filename
                    $filename = 'yachts/' . uniqid() . '.jpg';

                    // Save to storage
                    Storage::disk('public')->put($filename, $imageContent);

                    // Create database record
                    YachtImage::create([
                        'yacht_id' => $yacht->id,
                        'path' => $filename,
                        'is_primary' => $i === 0,
                    ]);
                }
            }
        } catch (\Exception $e) {
            $this->command->warn("  ⚠ Could not download images for {$yacht->title}: {$e->getMessage()}");
        }
    }

    /**
     * Create seasonal pricing for a yacht.
     */
    private function createPricing(Yacht $yacht): void
    {
        $seasons = [
            ['start' => now()->startOfYear(), 'end' => now()->startOfYear()->addMonths(3), 'multiplier' => 0.8],
            ['start' => now()->startOfYear()->addMonths(3), 'end' => now()->startOfYear()->addMonths(6), 'multiplier' => 1.0],
            ['start' => now()->startOfYear()->addMonths(6), 'end' => now()->startOfYear()->addMonths(9), 'multiplier' => 1.5],
            ['start' => now()->startOfYear()->addMonths(9), 'end' => now()->startOfYear()->addMonths(12), 'multiplier' => 1.2],
        ];

        $basePrice = match ($yacht->type) {
            'sailboat' => rand(1500, 2500),
            'motorboat' => rand(2000, 3500),
            'catamaran' => rand(2500, 4000),
            'yacht' => rand(3500, 7000),
            default => 2000,
        };

        foreach ($seasons as $season) {
            Pricing::create([
                'yacht_id' => $yacht->id,
                'start_date' => $season['start'],
                'end_date' => $season['end'],
                'price_per_week' => $basePrice * $season['multiplier'],
            ]);
        }
    }
}
