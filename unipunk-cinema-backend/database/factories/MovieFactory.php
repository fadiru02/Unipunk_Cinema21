<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MovieFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(3);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'synopsis' => $this->faker->paragraph(),
            'duration' => $this->faker->numberBetween(90, 180),
            'rating_age' => $this->faker->randomElement(['SU', '13+', '17+']),
            'language' => 'English',
            'subtitle' => 'Indonesia',
            'release_date' => now()->toDateString(),
            'end_date' => now()->addMonth()->toDateString(),
            'status' => 'now_playing',
            'poster_url' => 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500',
            'banner_url' => 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600',
            'trailer_url' => 'https://youtube.com/watch?v=demo',
        ];
    }
}