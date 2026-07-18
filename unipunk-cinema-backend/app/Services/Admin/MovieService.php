<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\MovieRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class MovieService
{
    protected MovieRepositoryInterface $movieRepository;

    public function __construct(MovieRepositoryInterface $movieRepository)
    {
        $this->movieRepository = $movieRepository;
    }

    public function getAllMovies()
    {
        return $this->movieRepository->all();
    }

    public function createMovie(array $data)
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = Str::slug($data['title']) . '-' . rand(1000, 9999);
            
            $movie = $this->movieRepository->create($data);
            $movie->genres()->sync($data['genre_ids']);
            
            return $movie;
        });
    }

    public function updateMovie(mixed $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $movie = $this->movieRepository->find($id);
            if (!$movie) return null;

            $data['slug'] = Str::slug($data['title']) . '-' . rand(1000, 9999);
            $movie->update($data);
            $movie->genres()->sync($data['genre_ids']);
            
            return $movie;
        });
    }

    public function deleteMovie(mixed $id)
    {
        return $this->movieRepository->delete($id);
    }

    public function getMovieById(mixed $id)
    {
        return $this->movieRepository->find($id);
    }
}