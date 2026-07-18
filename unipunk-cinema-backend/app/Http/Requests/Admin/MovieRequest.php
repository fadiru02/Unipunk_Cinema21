<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MovieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'synopsis' => ['required', 'string'],
            'duration' => ['required', 'integer', 'min:1'],
            'poster_url' => ['nullable', 'url'],
            'banner_url' => ['nullable', 'url'],
            'trailer_url' => ['nullable', 'url'],
            'rating_age' => ['required', 'string'],
            'language' => ['required', 'string'],
            'subtitle' => ['nullable', 'string'],
            'release_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:release_date'],
            'status' => ['required', 'in:now_playing,coming_soon,archived'],
            'genre_ids' => ['required', 'array'],
            'genre_ids.*' => ['exists:genres,id'],
        ];
    }
}