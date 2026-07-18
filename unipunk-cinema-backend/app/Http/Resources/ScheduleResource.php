<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'movie_id' => $this->movie_id,
            'studio' => [
                'id' => $this->studio->id,
                'name' => $this->studio->name,
                'capacity' => $this->studio->capacity,
            ],
            'start_date' => $this->start_date->toDateString(),
            'start_time' => substr($this->start_time, 0, 5),
            'price' => (float) $this->price,
        ];
    }
}