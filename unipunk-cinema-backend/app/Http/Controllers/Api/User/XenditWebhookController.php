<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class XenditWebhookController extends Controller
{
    public function handleCallback(Request $request): JsonResponse
    {
        $callbackToken = $request->header('x-callback-token');
        if ($callbackToken !== config('xendit.webhook_token')) {
            return response()->json(['message' => 'Invalid webhook token'], 401);
        }

        $externalId = $request->input('external_id');
        $status = $request->input('status');

        $booking = DB::table('bookings')->where('xendit_external_id', $externalId)->first();
        if (!$booking) {
            return response()->json(['message' => 'Booking record not found'], 404);
        }

        if ($status === 'PAID') {
            DB::table('bookings')->where('id', $booking->id)->update([
                'status' => 'PAID',
                'updated_at' => now(),
            ]);
        } elseif ($status === 'EXPIRED') {
            DB::table('bookings')->where('id', $booking->id)->update([
                'status' => 'EXPIRED',
                'updated_at' => now(),
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Webhook processed successfully']);
    }
}