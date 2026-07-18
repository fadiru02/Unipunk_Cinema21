import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';
import { Button } from '../ui/Button';

export function CheckoutPage() {
    const { scheduleId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const selectedSeats = state?.selectedSeats || [];

    const checkoutMutation = useMutation({
        mutationFn: async () => {
            const seatIds = selectedSeats.map(s => s.id);
            const res = await axiosInstance.post(`/schedules/${scheduleId}/checkout`, { seat_ids: seatIds });
            return res.data.data;
        },
        onSuccess: (data) => {
            toast.success('Invoice Xendit berhasil dibuat! Mengalihkan...');
            window.location.href = data.invoice_url;
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Gagal memproses transaksi checkout.');
        }
    });

    if (selectedSeats.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24 text-center">
                <div className="inline-block p-6 bg-[#121212] border-2 border-neutral-800 font-black uppercase text-neutral-500">
                    Tidak ada kursi yang dipilih. Kembali ke halaman utama.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#080808] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-3xl mx-auto px-6 space-y-10">
                <div className="border-2 border-neutral-800 bg-[#121212] p-6 shadow-[6px_6px_0px_0px_#1a1a1a]">
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Order Review</h1>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mt-1">Selesaikan pembayaran untuk mengamankan tiket Anda</p>
                </div>

                <div className="border-2 border-neutral-800 bg-[#121212] p-8 shadow-[6px_6px_0px_0px_#1a1a1a] space-y-6">
                    <div className="border-b-2 border-neutral-900 pb-4 space-y-1">
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Selected Seats</span>
                        <p className="text-lg font-black uppercase">{selectedSeats.map(s => s.label).join(', ')}</p>
                    </div>

                    <div className="border-b-2 border-neutral-900 pb-4 space-y-2">
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Price Breakdown</span>
                        {selectedSeats.map((seat) => (
                            <div key={seat.id} className="flex justify-between text-xs font-bold uppercase text-neutral-400">
                                <span>Seat {seat.label} ({seat.type})</span>
                                <span className="text-white">Item Included</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-black uppercase tracking-wider text-neutral-400">Total Price Summary</span>
                        <span className="text-2xl font-black text-brand-primary tracking-tight">Calculated at Payment</span>
                    </div>

                    <Button 
                        disabled={checkoutMutation.isPending}
                        onClick={() => checkoutMutation.mutate()}
                        className="w-full border-2 border-black font-black text-xs uppercase tracking-wider py-4 bg-brand-primary text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-30 transition-all"
                    >
                        {checkoutMutation.isPending ? 'Redirecting to Xendit...' : 'Proceed to Payment Gateway'}
                    </Button>
                </div>
            </div>
        </div>
    );
}