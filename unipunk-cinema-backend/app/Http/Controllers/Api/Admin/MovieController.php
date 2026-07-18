<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MovieRequest;
use App\Http\Resources\MovieResource;
use App\Services\Admin\MovieService;
use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    protected MovieService $movieService;

    public function __construct(MovieService $movieService)
    {
        $this->movieService = $movieService;
    }

    public function index(): JsonResponse
    {
        $movies = $this->movieService->getAllMovies();
        $movies->load('genres');
        return $this->success(MovieResource::collection($movies), 'Daftar film berhasil diambil');
    }

    public function store(MovieRequest $request): JsonResponse
    {
        $movie = $this->movieService->createMovie($request->validated());
        $movie->load('genres');
        return $this->success(new MovieResource($movie), 'Film berhasil ditambahkan', 201);
    }

    public function show(mixed $id): JsonResponse
    {
        $movie = $this->movieService->getMovieById($id);
        if (!$movie) {
            return $this->error('Film tidak ditemukan', 404);
        }
        $movie->load('genres');
        return $this->success(new MovieResource($movie), 'Detail film berhasil diambil');
    }

    public function update(MovieRequest $request, mixed $id): JsonResponse
    {
        $movie = $this->movieService->updateMovie($id, $request->validated());
        if (!$movie) {
            return $this->error('Film tidak ditemukan atau gagal diupdate', 404);
        }
        $movie->load('genres');
        return $this->success(new MovieResource($movie), 'Film berhasil diupdate');
    }

    public function destroy(mixed $id): JsonResponse
    {
        $deleted = $this->movieService->deleteMovie($id);
        if (!$deleted) {
            return $this->error('Film tidak ditemukan atau gagal dihapus', 404);
        }
        return $this->success(null, 'Film berhasil dihapus');
    }
}