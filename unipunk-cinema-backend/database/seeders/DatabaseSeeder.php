<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Movie;
use App\Models\Studio;
use App\Models\Seat;
use App\Models\Schedule;
use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Unipunk',
            'email' => 'admin@unipunk.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $genres = Genre::factory(5)->create();
        $movies = Movie::factory(6)->create();

        foreach ($movies as $movie) {
            $movie->genres()->attach($genres->random(2)->pluck('id')->toArray());
        }

        $studio1 = Studio::create([
            'id' => 1,
            'name' => 'Studio 1',
            'capacity' => 40
        ]);

        $studio2 = Studio::create([
            'id' => 2,
            'name' => 'Studio 2',
            'capacity' => 40
        ]);

        $studios = [$studio1, $studio2];

        foreach ($studios as $studio) {
            $rows = ['A', 'B', 'C', 'D'];
            foreach ($rows as $row) {
                for ($i = 1; $i <= 10; $i++) {
                    $type = 'regular';
                    if ($row === 'A') $type = 'vip';
                    if ($row === 'D' && $i > 8) $type = 'couple';

                    Seat::create([
                        'studio_id' => $studio->id,
                        'row_letter' => $row,
                        'seat_number' => $i,
                        'type' => $type,
                        'is_active' => 1,
                    ]);
                }
            }
        }

        Schedule::create([
            'id' => 1,
            'movie_id' => $movies[0]->id,
            'studio_id' => 1,
            'start_date' => now()->toDateString(),
            'start_time' => '13:00:00',
            'price' => 45000,
        ]);

        Schedule::create([
            'id' => 2,
            'movie_id' => $movies[1]->id,
            'studio_id' => 2,
            'start_date' => now()->toDateString(),
            'start_time' => '16:00:00',
            'price' => 50000,
        ]);

        Schedule::create([
            'id' => 3,
            'movie_id' => $movies[2]->id,
            'studio_id' => 1,
            'start_date' => now()->toDateString(),
            'start_time' => '19:00:00',
            'price' => 40000,
        ]);

        Schedule::create([
            'id' => 4,
            'movie_id' => $movies[3]->id,
            'studio_id' => 2,
            'start_date' => now()->toDateString(),
            'start_time' => '20:30:00',
            'price' => 45000,
        ]);
    }
}