<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GenreRequest;
use App\Http\Resources\GenreResource;
use App\Services\Admin\GenreService;
use Illuminate\Http\JsonResponse;

class GenreController extends Controller
{
    protected GenreService $genreService;

    public function __construct(GenreService $genreService)
    {
        $this->genreService = $genreService;
    }

    public function index(): JsonResponse
    {
        $genres = $this->genreService->getAllGenres();
        return $this->success(GenreResource::collection($genres), 'Daftar genre berhasil diambil');
    }

    public function store(GenreRequest $request): JsonResponse
    {
        $genre = $this->genreService->createGenre($request->validated());
        return $this->success(new GenreResource($genre), 'Genre berhasil dibuat', 201);
    }

    public function show(mixed $id): JsonResponse
    {
        $genre = $this->genreService->getGenreById($id);
        if (!$genre) {
            return $this->error('Genre tidak ditemukan', 404);
        }
        return $this->success(new GenreResource($genre), 'Detail genre berhasil diambil');
    }

    public function update(GenreRequest $request, mixed $id): JsonResponse
    {
        $genre = $this->genreService->updateGenre($id, $request->validated());
        if (!$genre) {
            return $this->error('Genre tidak ditemukan atau gagal diupdate', 404);
        }
        return $this->success(new GenreResource($genre), 'Genre berhasil diupdate');
    }

    public function destroy(mixed $id): JsonResponse
    {
        $deleted = $this->genreService->deleteGenre($id);
        if (!$deleted) {
            return $this->error('Genre tidak ditemukan atau gagal dihapus', 404);
        }
        return $this->success(null, 'Genre berhasil dihapus');
    }
}