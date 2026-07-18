<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk halaman ini.',
                'errors' => null,
                'data' => null
            ], 403);
        }

        return $next($request);
    }
}