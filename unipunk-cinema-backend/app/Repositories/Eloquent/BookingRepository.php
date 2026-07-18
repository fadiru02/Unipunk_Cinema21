<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingRepository extends BaseRepository implements BookingRepositoryInterface
{
    public function __construct(Booking $model)
    {
        parent::__construct($model);
    }

    public function getRevenueByPeriod(string $startDate, string $endDate): float
    {
        return (float) $this->model
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');
    }

    public function getBookingCountByPeriod(string $startDate, string $endDate): int
    {
        return $this->model
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
    }

    public function getSeatOccupancyRate(): array
    {
        return $this->model->newQuery()
            ->join('schedules', 'bookings.schedule_id', '=', 'schedules.id')
            ->join('studios', 'schedules.studio_id', '=', 'studios.id')
            ->join('booking_details', 'bookings.id', '=', 'booking_details.booking_id')
            ->where('bookings.status', 'PAID')
            ->select(
                'studios.name as studio_name',
                DB::raw('COUNT(booking_details.id) as seats_booked'),
                'studios.capacity'
            )
            ->groupBy('studios.id', 'studios.name', 'studios.capacity')
            ->get()
            ->map(function ($item) {
                $item->occupancy_rate = $item->capacity > 0 
                    ? round(($item->seats_booked / $item->capacity) * 100, 2) 
                    : 0;
                return $item;
            })
            ->toArray();
    }

    public function getPopularMovies(int $limit = 5): array
    {
        return $this->model->newQuery()
            ->join('schedules', 'bookings.schedule_id', '=', 'schedules.id')
            ->join('movies', 'schedules.movie_id', '=', 'movies.id')
            ->where('bookings.status', 'PAID')
            ->select(
                'movies.id',
                'movies.title',
                DB::raw('COUNT(bookings.id) as total_bookings'),
                DB::raw('SUM(bookings.total_amount) as total_revenue')
            )
            ->groupBy('movies.id', 'movies.title')
            ->orderByDesc('total_bookings')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getSeatsWithStatus(int $scheduleId): array
    {
        $schedule = DB::table('schedules')->where('id', $scheduleId)->first();
        if (!$schedule) {
            return [];
        }

        $seats = DB::table('seats')
            ->where('studio_id', $schedule->studio_id)
            ->get();

        $bookedSeatIds = DB::table('booking_details')
            ->join('bookings', 'booking_details.booking_id', '=', 'bookings.id')
            ->where('bookings.schedule_id', $scheduleId)
            ->whereIn('bookings.status', ['PAID', 'PENDING'])
            ->pluck('booking_details.seat_id')
            ->toArray();

        $lockedSeatIds = DB::table('seat_locks')
            ->where('schedule_id', $scheduleId)
            ->where('expires_at', '>', Carbon::now())
            ->pluck('seat_id')
            ->toArray();

        return $seats->map(function ($seat) use ($bookedSeatIds, $lockedSeatIds) {
            $status = 'available';
            if (in_array($seat->id, $bookedSeatIds)) {
                $status = 'booked';
            } elseif (in_array($seat->id, $lockedSeatIds)) {
                $status = 'locked';
            }

            return [
                'id' => (int) $seat->id,
                'row_letter' => $seat->row_letter,
                'seat_number' => (int) $seat->seat_number,
                'label' => $seat->row_letter . $seat->seat_number,
                'type' => $seat->type,
                'status' => $status,
            ];
        })->toArray();
    }

    public function lockSeatsTransaction(int $scheduleId, array $seatIds, int $userId): void
    {
        DB::transaction(function () use ($scheduleId, $seatIds, $userId) {
            $checkBooked = DB::table('booking_details')
                ->join('bookings', 'booking_details.booking_id', '=', 'bookings.id')
                ->where('bookings.schedule_id', $scheduleId)
                ->whereIn('bookings.status', ['PAID', 'PENDING'])
                ->whereIn('booking_details.seat_id', $seatIds)
                ->lockForUpdate()
                ->exists();

            if ($checkBooked) {
                throw \Illuminate\Validation\ValidationException::withMessages(['seats' => 'One or more selected seats are already booked.']);
            }

            $checkLocked = DB::table('seat_locks')
                ->where('schedule_id', $scheduleId)
                ->whereIn('seat_id', $seatIds)
                ->where('expires_at', '>', Carbon::now())
                ->where('user_id', '!=', $userId)
                ->lockForUpdate()
                ->exists();

            if ($checkLocked) {
                throw \Illuminate\Validation\ValidationException::withMessages(['seats' => 'One or more selected seats are temporarily locked by another user.']);
            }

            DB::table('seat_locks')
                ->where('schedule_id', $scheduleId)
                ->where('user_id', $userId)
                ->delete();

            foreach ($seatIds as $seatId) {
                DB::table('seat_locks')->updateOrInsert(
                    ['schedule_id' => $scheduleId, 'seat_id' => $seatId],
                    ['user_id' => $userId, 'expires_at' => Carbon::now()->addMinutes(10), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
                );
            }
        });
    }
}