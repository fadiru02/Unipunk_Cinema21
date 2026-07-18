<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StudioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Studio ' . $this->faker->unique()->numberBetween(1, 5),
            'capacity' => 40,
        ];
    }
}