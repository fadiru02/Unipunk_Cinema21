<?php

namespace App\Repositories\Contracts;

interface BookingRepositoryInterface extends RepositoryInterface
{
    public function getRevenueByPeriod(string $startDate, string $endDate): float;
    public function getBookingCountByPeriod(string $startDate, string $endDate): int;
    public function getSeatOccupancyRate(): array;
    public function getPopularMovies(int $limit = 5): array;
    public function getSeatsWithStatus(int $scheduleId): array;
    public function lockSeatsTransaction(int $scheduleId, array $seatIds, int $userId): void;
}