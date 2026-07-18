<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\GenreController;
use App\Http\Controllers\Api\Admin\MovieController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\User\MovieUserController;
use App\Http\Controllers\Api\User\XenditWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::apiResource('movies', MovieController::class);
        Route::apiResource('genres', GenreController::class);
    });

    Route::prefix('user')->group(function () {
        Route::get('movies', [MovieUserController::class, 'index']);
        Route::get('movies/{slug}', [MovieUserController::class, 'show']);
        Route::get('movies/{slug}/schedules', [MovieUserController::class, 'schedules']);
    });
    
    Route::get('schedules/{id}/seats', [MovieUserController::class, 'getSeatsLayout']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('schedules/{id}/lock', [MovieUserController::class, 'lockSeats']);
        Route::post('schedules/{id}/checkout', [MovieUserController::class, 'checkout']);
    });
});

Route::post('webhooks/xendit', [XenditWebhookController::class, 'handleCallback']);