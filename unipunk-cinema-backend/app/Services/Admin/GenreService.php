<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\GenreRepositoryInterface;
use Illuminate\Support\Str;

class GenreService
{
    protected GenreRepositoryInterface $genreRepository;

    public function __construct(GenreRepositoryInterface $genreRepository)
    {
        $this->genreRepository = $genreRepository;
    }

    public function getAllGenres()
    {
        return $this->genreRepository->all();
    }

    public function createGenre(array $data)
    {
        $data['slug'] = Str::slug($data['name']);
        return $this->genreRepository->create($data);
    }

    public function updateGenre(mixed $id, array $data)
    {
        $data['slug'] = Str::slug($data['name']);
        return $this->genreRepository->update($id, $data);
    }

    public function deleteGenre(mixed $id)
    {
        return $this->genreRepository->delete($id);
    }

    public function getGenreById(mixed $id)
    {
        return $this->genreRepository->find($id);
    }
}