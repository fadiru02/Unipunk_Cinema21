<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'synopsis' => $this->synopsis,
            'duration' => $this->duration,
            'poster_url' => $this->poster_url,
            'banner_url' => $this->banner_url,
            'trailer_url' => $this->trailer_url,
            'rating_age' => $this->rating_age,
            'language' => $this->language,
            'subtitle' => $this->subtitle,
            'release_date' => $this->release_date->toDateString(),
            'end_date' => $this->end_date->toDateString(),
            'status' => $this->status,
            'genres' => GenreResource::collection($this->whenLoaded('genres')),
        ];
    }
}