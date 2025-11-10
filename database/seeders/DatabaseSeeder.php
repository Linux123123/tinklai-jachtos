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

                $this->command->info('🌊 Kuriami jachtų nuomos portalo duomenys...');

        // Create admin
        $this->command->info('👤 Kuriamas administratoriaus vartotojas...');
        $admin = User::create([
            'name' => 'Admin Vartotojas',
            'email' => 'admin@yacht.com',
            'password' => 'password',
        ]);
        $admin->assignRole(Role::ADMIN->value);

        // Create yacht owners
        $this->command->info('🌊 Kuriami jachtų nuomos portalo duomenys...');

        // Create admin
        $this->command->info('👤 Kuriamas administratoriaus vartotojas...');
        $admin = User::create([
            'name' => 'Admin Vartotojas',
            'email' => 'admin@yacht.com',
            'password' => 'password',
        ]);
        $admin->assignRole(Role::ADMIN->value);

        // Create yacht owners
        $this->command->info(' Kuriami jachtų savininkų vartotojai...');
        $owners = [
            ['name' => 'Jonas Jonaitis', 'email' => 'jonas@yacht.com'],
            ['name' => 'Sara Jonaitienė', 'email' => 'sara@yacht.com'],
            ['name' => 'Mykolas Rudys', 'email' => 'mykolas@yacht.com'],
            ['name' => 'Ema Vilson', 'email' => 'ema@yacht.com'],
            ['name' => 'Davidas Milleris', 'email' => 'davidas@yacht.com'],
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
        $this->command->info('👥 Kuriami klientų vartotojai...');
        $clients = [
            ['name' => 'Aistė Kuper', 'email' => 'aiste@client.com'],
            ['name' => 'Robertas Tailorius', 'email' => 'robertas@client.com'],
            ['name' => 'Karolina Baltaitė', 'email' => 'karolina@client.com'],
            ['name' => 'Danielius Haris', 'email' => 'danielius@client.com'],
            ['name' => 'Ieva Martinez', 'email' => 'ieva@client.com'],
            ['name' => 'Pranas Garcia', 'email' => 'pranas@client.com'],
            ['name' => 'Grasilda Li', 'email' => 'grasilda@client.com'],
            ['name' => 'Henrikas Klarkas', 'email' => 'henrikas@client.com'],
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
        $this->command->info('👥 Kuriami klientų vartotojai...');
        $clients = [
            ['name' => 'Aistė Kuper', 'email' => 'aiste@client.com'],
            ['name' => 'Robertas Tailorius', 'email' => 'robertas@client.com'],
            ['name' => 'Karolina Baltaitė', 'email' => 'karolina@client.com'],
            ['name' => 'Danielius Haris', 'email' => 'danielius@client.com'],
            ['name' => 'Ieva Martinez', 'email' => 'ieva@client.com'],
            ['name' => 'Pranas Garcia', 'email' => 'pranas@client.com'],
            ['name' => 'Grasilda Li', 'email' => 'grasilda@client.com'],
            ['name' => 'Henrikas Klarkas', 'email' => 'henrikas@client.com'],
        ];
        $owners = [
            ['name' => 'Jonas Jonaitis', 'email' => 'jonas@yacht.com'],
            ['name' => 'Sara Jonaitienė', 'email' => 'sara@yacht.com'],
            ['name' => 'Mykolas Rudys', 'email' => 'mykolas@yacht.com'],
            ['name' => 'Ema Vilson', 'email' => 'ema@yacht.com'],
            ['name' => 'Davidas Milleris', 'email' => 'davidas@yacht.com'],
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
        $this->command->info('👥 Kuriami klientų vartotojai...');
        $clients = [
            ['name' => 'Aistė Kuper', 'email' => 'aiste@client.com'],
            ['name' => 'Robertas Tailorius', 'email' => 'robertas@client.com'],
            ['name' => 'Karolina Baltaitė', 'email' => 'karolina@client.com'],
            ['name' => 'Danielius Haris', 'email' => 'danielius@client.com'],
            ['name' => 'Ieva Martinez', 'email' => 'ieva@client.com'],
            ['name' => 'Pranas Garcia', 'email' => 'pranas@client.com'],
            ['name' => 'Grasilda Li', 'email' => 'grasilda@client.com'],
            ['name' => 'Henrikas Klarkas', 'email' => 'henrikas@client.com'],
        ];

        // Create clients
        $this->command->info('👥 Kuriami klientų vartotojai...');
        $clients = [
            ['name' => 'Aistė Kuper', 'email' => 'aiste@client.com'],
            ['name' => 'Robertas Tailorius', 'email' => 'robertas@client.com'],
            ['name' => 'Karolina Baltaitė', 'email' => 'karolina@client.com'],
            ['name' => 'Danielius Haris', 'email' => 'danielius@client.com'],
            ['name' => 'Ieva Martinez', 'email' => 'ieva@client.com'],
            ['name' => 'Pranas Garcia', 'email' => 'pranas@client.com'],
            ['name' => 'Grasilda Li', 'email' => 'grasilda@client.com'],
            ['name' => 'Henrikas Klarkas', 'email' => 'henrikas@client.com'],
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
                'title' => 'Vandenyno Svajonė',
                'description' => 'Prabangi burinė jachta, puikiai tinkanti romantiškiems pabėgimams. Turi erdvų denį, patogias kajutes ir modernius patogumus. Mėgaukitės kvapą gniaužiančiais saulėlydžiais ir ramiomis buriavimo patirtimis.',
                'type' => 'sailboat',
                'capacity' => 6,
                'location' => 'Majamis, Florida',
                'query' => 'luxury sailing yacht',
            ],
            [
                'title' => 'Jūros Vėjas',
                'description' => 'Moderni motorinė jachta su galingais varikliais ir aptakiu dizainu. Idealiai tinka greičio entuziastams ir salų lankymo nuotykiams. Įrengta moderniausia navigacijos sistema.',
                'type' => 'motorboat',
                'capacity' => 8,
                'location' => 'San Diegas, Kalifornija',
                'query' => 'motor yacht ocean',
            ],
            [
                'title' => 'Rojaus Katamaranas',
                'description' => 'Erdvus katamaranas, siūlantis stabilumą ir komfortą šeimoms. Keli lygiai, didelės poilsio zonos ir puikios žvejybos vietos. Puikiai tinka grupiniams renginiams.',
                'type' => 'catamaran',
                'capacity' => 12,
                'location' => 'Ki Vestas, Florida',
                'query' => 'catamaran sailing',
            ],
            [
                'title' => 'Žydroji Dama',
                'description' => 'Elegantiška jachta su aukščiausios kokybės apdaila ir prabangiais apartamentais. Galima profesionali įgula. Idealiai tinka verslo renginiams ir ypatingoms progoms.',
                'type' => 'yacht',
                'capacity' => 10,
                'location' => 'Niuport Byčas, Kalifornija',
                'query' => 'luxury yacht deck',
            ],
            [
                'title' => 'Vėjo Šokėja',
                'description' => 'Klasikinė burinė jachta, jungianti tradicinį žavesį su moderniu komfortu. Puikiai tinka buriavimo puristams, vertinantiems autentiškas jūrines patirtis.',
                'type' => 'sailboat',
                'capacity' => 4,
                'location' => 'Čarlstonas, Pietų Karolina',
                'query' => 'classic sailboat',
            ],
            [
                'title' => 'Griaustinio Banga',
                'description' => 'Aukštos kokybės motorinė jachta adrenalino ieškotojams. Įrengta vandens sporto įranga, įskaitant vandens motociklus ir vandenlentę. Įtraukta pramogų sistema.',
                'type' => 'motorboat',
                'capacity' => 6,
                'location' => 'Majami Byčas, Florida',
                'query' => 'speed boat yacht',
            ],
            [
                'title' => 'Ramybė Dabar',
                'description' => 'Ramus katamaranas, puikiai tinkantis meditacijos retritams ir jogos sesijoms ant vandens. Ekologiškas dizainas su saulės panelėmis ir tvariomis savybėmis.',
                'type' => 'catamaran',
                'capacity' => 8,
                'location' => 'Honolulu, Havajai',
                'query' => 'catamaran sunset',
            ],
            [
                'title' => 'Karališkasis Keliautojas',
                'description' => 'Didinga mega jachta su sraigtasparnių nusileidimo aikštele ir keliais deniais. Kino salė, sporto salė ir SPA įranga. Aukščiausios prabangos patirtis ant vandens.',
                'type' => 'yacht',
                'capacity' => 16,
                'location' => 'Fort Loderdeilas, Florida',
                'query' => 'mega yacht luxury',
            ],
            [
                'title' => 'Pakrantės Kruizeris',
                'description' => 'Universali motorinė jachta, puikiai tinkanti pakrančių tyrinėjimui ir žvejybos išvykoms. Gerai įrengta virtuvė ir patogios miegamosios vietos.',
                'type' => 'motorboat',
                'capacity' => 5,
                'location' => 'Sietlas, Vašingtonas',
                'query' => 'fishing yacht',
            ],
            [
                'title' => 'Saulėlydžio Rojus',
                'description' => 'Graži burinė jachta su panoraminiais vaizdais ir erdviu deniu. Idealiai tinka fotografams ir saulėlydžių entuziastams. Romantiška atmosfera garantuota.',
                'type' => 'sailboat',
                'capacity' => 7,
                'location' => 'Santa Barbara, Kalifornija',
                'query' => 'sailboat sunset ocean',
            ],
        ];        // Create yachts with images
        $this->command->info('⛵ Kuriamos jachtos su tikromis nuotraukomis...');
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
            $this->command->info("  ✓ Sukurta: {$yacht->title}");
        }

        // Create bookings (past completed ones for reviews)
        $this->command->info('📅 Kuriami užsakymai...');
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
        $this->command->info('⭐ Kuriami atsiliepimai...');
        $reviewComments = [
            'Nuostabi patirtis! Jachta buvo puikios būklės, o savininkas labai paslaugus.',
            'Absoliučiai patiko! Tikrai užsisakyčiau dar kartą. Saulėlydžio vaizdai buvo įspūdingi.',
            'Puiki jachta, ramus plaukimas. Praleidome nepamirštamą laiką su šeima.',
            'Puikiai tiko mūsų metinėms. Viskas buvo taip, kaip aprašyta.',
            'Jachta viršijo mūsų lūkesčius. Profesionalus aptarnavimas ir gražus laivas.',
            'Nuostabi savaitė ant vandens. Jachta buvo švari, gerai prižiūrėta ir malonu ja plaukti.',
            'Išskirtinė patirtis! Savininkas pateikė puikių rekomendacijų maršrutams.',
            'Geriausios atostogos! Jachta buvo prabangi ir patogi.',
            'Labai rekomenduoju šią jachtą. Puikus kainos ir kokybės santykis ir fantastiški prisiminimai.',
            'Neįtikėtinas laikas! Jachta buvo tobula mūsų grupei ir labai erdvi.',
            'Fantastiška jachta su visais reikalingais patogumais. Savininkas buvo atsakingas ir draugiškas.',
            'Graži jachta, sklandus užsakymo procesas. Tikrai grįšime!',
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
        $this->command->info('💬 Kuriamos žinutės...');
        $messageTemplates = [
            'Sveiki! Norėčiau užsisakyti jūsų jachtą. Ar ji laisva kitą mėnesį?',
            'Sveiki! Ar galėtumėte pateikti daugiau informacijos apie įtrauktus patogumus?',
            'Ačiū už nuostabią patirtį! Jachta buvo tobula.',
            'Turiu klausimą dėl registracijos proceso. Kada galime įlipti?',
            'Ar kapitonas įskaičiuotas, ar reikia jį samdyti atskirai?',
            'Ar galite pritaikyti maitinimo paslaugas pagal mitybos apribojimus?',
            'Kokia yra užsakymų atšaukimo politika?',
            'Norėčiau pratęsti savo užsakymą keliomis dienomis. Ar tai įmanoma?',
        ];

        $ownerResponses = [
            'Ačiū už susidomėjimą! Taip, jachta laisva. Atsiųsiu jums daugiau informacijos.',
            'Žinoma! Jachtoje yra visi standartiniai patogumai ir vandens sporto įranga.',
            'Labai ačiū! Buvo malonu jus priimti.',
            'Galite įlipti bet kada po 14 val. Aš būsiu ten, kad viską aprodyti.',
            'Profesionalus kapitonas įskaičiuotas į kainą jūsų saugumui ir patogumui.',
            'Absoliučiai! Galime prisitaikyti prie bet kokių mitybos poreikių. Tiesiog praneškite mums iš anksto.',
            'Galite atšaukti likus 14 dienų iki užsakymo ir gauti visą pinigų grąžinimą.',
            'Mielai tai padarysiu! Leiskite patikrinti tvarkaraštį.',
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

        $this->command->info('✅ Duomenų bazės užpildymas sėkmingai baigtas!');
        $this->command->info('📊 Santrauka:');
        $this->command->info('   - Vartotojai: ' . User::count());
        $this->command->info('   - Jachtos: ' . Yacht::count());
        $this->command->info('   - Užsakymai: ' . Booking::count());
        $this->command->info('   - Atsiliepimai: ' . Review::count());
        $this->command->info('   - Žinutės: ' . Message::count());
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
            $this->command->warn("  ⚠ Nepavyko atsiųsti nuotraukų jachtai {$yacht->title}: {$e->getMessage()}");
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
