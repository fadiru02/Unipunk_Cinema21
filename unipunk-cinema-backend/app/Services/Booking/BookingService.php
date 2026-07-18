<?php

namespace App\Services\Booking;

use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class BookingService
{
    protected BookingRepositoryInterface $bookingRepository;

    public function __construct(BookingRepositoryInterface $bookingRepository)
    {
        $this->bookingRepository = $bookingRepository;
    }

    public function getLayout(int $scheduleId): array
    {
        return $this->bookingRepository->getSeatsWithStatus($scheduleId);
    }

    public function processSeatLock(int $scheduleId, array $seatIds, int $userId): void
    {
        $this->bookingRepository->lockSeatsTransaction($scheduleId, $seatIds, $userId);
    }

    public function createCheckoutInvoice(int $scheduleId, array $seatIds, int $userId, string $userEmail): array
    {
        return DB::transaction(function () use ($scheduleId, $seatIds, $userId, $userEmail) {
            $schedule = DB::table('schedules')->where('id', $scheduleId)->first();
            
            if (!$schedule) {
                throw ValidationException::withMessages(['schedule' => 'Jadwal tayang tidak ditemukan.']);
            }

            $basePrice = $schedule->price;
            $totalAmount = 0;
            
            $seats = DB::table('seats')->whereIn('id', $seatIds)->get();
            
            if ($seats->isEmpty()) {
                throw ValidationException::withMessages(['seats' => 'Kursi tidak valid.']);
            }

            foreach ($seats as $seat) {
                $seatPrice = $basePrice;
                if ($seat->type === 'vip') $seatPrice += 15000;
                if ($seat->type === 'couple') $seatPrice += 25000;
                $totalAmount += $seatPrice;
            }

            $bookingCode = 'UNPK-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            $externalId = 'INV-' . $bookingCode;

            $bookingId = DB::table('bookings')->insertGetId([
                'booking_code' => $bookingCode,
                'user_id' => $userId,
                'schedule_id' => $scheduleId,
                'total_amount' => $totalAmount,
                'status' => 'PENDING',
                'xendit_external_id' => $externalId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($seats as $seat) {
                $seatPrice = $basePrice;
                if ($seat->type === 'vip') $seatPrice += 15000;
                if ($seat->type === 'couple') $seatPrice += 25000;

                DB::table('booking_details')->insert([
                    'booking_id' => $bookingId,
                    'seat_id' => $seat->id,
                    'price' => $seatPrice,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('seat_locks')
                ->where('schedule_id', $scheduleId)
                ->where('user_id', $userId)
                ->delete();

            $xenditSecretKey = config('xendit.secret_key');
            
            $response = Http::withBasicAuth($xenditSecretKey, '')
                ->post('https://api.xendit.co/v2/invoices', [
                    'external_id' => $externalId,
                    'amount' => $totalAmount,
                    'payer_email' => $userEmail,
                    'description' => 'Pembayaran Tiket Bioskop - ' . $bookingCode,
                    'success_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard',
                    'failure_redirect_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard',
                ]);

            if ($response->failed()) {
                throw new \Exception('Payment Gateway Error: ' . $response->body());
            }

            $invoiceData = $response->json();
            $invoiceUrl = $invoiceData['invoice_url'];

            DB::table('bookings')->where('id', $bookingId)->update([
                'invoice_url' => $invoiceUrl,
            ]);

            return [
                'booking_code' => $bookingCode,
                'total_amount' => $totalAmount,
                'invoice_url' => $invoiceUrl,
            ];
        });
    }
}