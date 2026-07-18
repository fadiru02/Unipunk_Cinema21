<?php

namespace Database\Factories;

use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'studio_id' => Studio::factory(),
            'row_letter' => $this->faker->randomElement(['A', 'B', 'C', 'D']),
            'seat_number' => $this->faker->numberBetween(1, 10),
            'type' => 'regular',
            'is_active' => 1,
        ];
    }
}