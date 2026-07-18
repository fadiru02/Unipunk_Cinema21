<?php

namespace Database\Factories;

use App\Models\Movie;
use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'movie_id' => Movie::factory(),
            'studio_id' => Studio::factory(),
            'start_date' => now()->toDateString(),
            'start_time' => $this->faker->randomElement(['13:00:00', '16:00:00', '19:00:00', '21:30:00']),
            'price' => $this->faker->randomElement([35000, 40000, 50000]),
        ];
    }
}