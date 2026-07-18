<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GenreFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'Action', 'Comedy', 'Horror', 'Drama', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}