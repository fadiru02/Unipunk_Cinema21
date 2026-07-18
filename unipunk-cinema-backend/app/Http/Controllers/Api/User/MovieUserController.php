<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CheckoutRequest;
use App\Http\Requests\User\PreBookingRequest;
use App\Services\Booking\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MovieUserController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function getSeatsLayout(int $scheduleId): JsonResponse
    {
        $schedule = DB::table('schedules')->where('id', $scheduleId)->first();
        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan',
                'data' => []
            ], 404);
        }

        $seats = DB::table('seats')->where('studio_id', $schedule->studio_id)->get();

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

        $layout = $seats->map(function ($seat) use ($bookedSeatIds, $lockedSeatIds) {
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
        });

        return response()->json([
            'success' => true,
            'message' => 'Layout kursi berhasil diambil',
            'data' => $layout
        ], 200);
    }

    public function lockSeats(PreBookingRequest $request, int $scheduleId): JsonResponse
    {
        $this->bookingService->processSeatLock(
            $scheduleId, 
            $request->validated()['seat_ids'], 
            $request->user()->id
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Kursi berhasil dikunci sementara',
            'data' => null
        ], 200);
    }

    public function checkout(CheckoutRequest $request, int $scheduleId): JsonResponse
    {
        $result = $this->bookingService->createCheckoutInvoice(
            $scheduleId,
            $request->validated()['seat_ids'],
            $request->user()->id,
            $request->user()->email
        );

        return response()->json([
            'success' => true,
            'message' => 'Invoice checkout berhasil dibuat via Xendit',
            'data' => $result
        ], 200);
    }
}