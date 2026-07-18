<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Carbon;

class DashboardService
{
    protected BookingRepositoryInterface $bookingRepository;

    public function __construct(BookingRepositoryInterface $bookingRepository)
    {
        $this->bookingRepository = $bookingRepository;
    }

    public function getDashboardMetrics(): array
    {
        $now = Carbon::now();
        
        $startOfDay = $now->copy()->startOfDay()->toDateTimeString();
        $endOfDay = $now->copy()->endOfDay()->toDateTimeString();
        
        $startOfWeek = $now->copy()->startOfWeek()->toDateTimeString();
        $endOfWeek = $now->copy()->endOfWeek()->toDateTimeString();
        
        $startOfMonth = $now->copy()->startOfMonth()->toDateTimeString();
        $endOfMonth = $now->copy()->endOfMonth()->toDateTimeString();

        return [
            'revenue' => [
                'today' => $this->bookingRepository->getRevenueByPeriod($startOfDay, $endOfDay),
                'weekly' => $this->bookingRepository->getRevenueByPeriod($startOfWeek, $endOfWeek),
                'monthly' => $this->bookingRepository->getRevenueByPeriod($startOfMonth, $endOfMonth),
            ],
            'bookings' => [
                'today' => $this->bookingRepository->getBookingCountByPeriod($startOfDay, $endOfDay),
                'weekly' => $this->bookingRepository->getBookingCountByPeriod($startOfWeek, $endOfWeek),
                'monthly' => $this->bookingRepository->getBookingCountByPeriod($startOfMonth, $endOfMonth),
            ],
            'seat_occupancy' => $this->bookingRepository->getSeatOccupancyRate(),
            'popular_movies' => $this->bookingRepository->getPopularMovies(5)
        ];
    }
}