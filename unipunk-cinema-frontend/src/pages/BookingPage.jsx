import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';
import { Button } from '../ui/Button';

export function BookingPage() {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedSeats, setSelectedSeats] = useState([]);

    const { data: responseData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['schedule-seats', scheduleId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/schedules/${scheduleId}/seats`);
            return res.data;
        }
    });

    const seats = responseData?.data || [];

    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row_letter]) {
            acc[seat.row_letter] = [];
        }
        acc[seat.row_letter].push(seat);
        return acc;
    }, {});

    const lockMutation = useMutation({
        mutationFn: async (seatIds) => {
            return await axiosInstance.post(`/schedules/${scheduleId}/lock`, { seat_ids: seatIds });
        },
        onSuccess: () => {
            toast.success('Kursi terkunci! Silakan selesaikan pembayaran.');
            navigate(`/checkout/${scheduleId}`, { state: { selectedSeats } });
        },
        onError: (err) => {
            if (err.response?.status === 401) {
                toast.error('Lo harus login dulu buat booking kursi ini!');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }
            const msg = err.response?.data?.message || 'Gagal mengunci kursi';
            toast.error(msg);
            refetch();
        }
    });

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked' || seat.status === 'locked') return;

        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24 text-center text-white font-black uppercase tracking-wider animate-pulse">
                LOADING SEAT MAP DATA...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#080808] min-h-screen pt-32 pb-24 text-white flex items-center justify-center px-6">
                <div className="border-4 border-brand-primary bg-[#121212] p-8 text-center shadow-[8px_8px_0px_0px_#E50914] max-w-lg w-full">
                    <h2 className="text-2xl font-black uppercase mb-3 tracking-tighter">API Error Detected</h2>
                    <p className="text-sm font-bold text-neutral-300 mb-6 bg-brand-primary/10 border-2 border-brand-primary p-4">
                        {error.response?.data?.message || error.message}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">
                        Status Code: {error.response?.status || 'Unknown'} <br/>
                        Cek tab Network (F12) untuk detail request.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#080808] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-16">
                
                <div className="w-full border-2 border-neutral-800 bg-[#121212] p-8 text-center shadow-[6px_6px_0px_0px_#1a1a1a]">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Select Your Seats</h1>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mt-1">Kursi yang Anda pilih otomatis terkunci selama 10 menit</p>
                </div>

                <div className="w-full flex flex-col items-center space-y-16 bg-[#121212] border-2 border-neutral-800 p-8 md:p-12 shadow-[6px_6px_0px_0px_#1a1a1a] overflow-x-auto">
                    <div className="w-full max-w-2xl border-4 border-black bg-white py-3 text-center text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#E50914] mb-8">
                        Layar Bioskop / Cinema Screen
                    </div>

                    {seats.length === 0 ? (
                        <div className="text-xs font-black uppercase tracking-wider text-neutral-500 py-6">
                            Data kursi untuk jadwal ini belum di-generate di database.
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4 w-full items-center min-w-[700px]">
                            {Object.keys(seatsByRow).sort().map((rowLetter) => (
                                <div key={rowLetter} className="flex items-center gap-6 justify-center w-full">
                                    <div className="w-6 text-base font-black text-brand-primary uppercase text-center shrink-0">
                                        {rowLetter}
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        {seatsByRow[rowLetter].map((seat) => {
                                            const isSelected = selectedSeats.find(s => s.id === seat.id);
                                            
                                            const sizeStyle = seat.type === 'couple' ? 'w-20 md:w-24 h-10 md:h-12' : 'w-10 h-10 md:w-12 md:h-12';
                                            
                                            let colorStyle = 'bg-white text-black border-black hover:bg-neutral-200';
                                            if (seat.type === 'vip') colorStyle = 'bg-purple-500 text-black border-black hover:bg-purple-400';
                                            if (seat.type === 'couple') colorStyle = 'bg-pink-400 text-black border-black hover:bg-pink-300';

                                            if (seat.status === 'booked' || seat.status === 'locked') {
                                                colorStyle = 'bg-neutral-900 text-neutral-600 border-neutral-800 cursor-not-allowed opacity-40';
                                            } else if (isSelected) {
                                                colorStyle = 'bg-brand-primary text-white border-black hover:bg-brand-accent shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]';
                                            }

                                            return (
                                                <button
                                                    key={seat.id}
                                                    disabled={seat.status === 'booked' || seat.status === 'locked'}
                                                    onClick={() => handleSeatClick(seat)}
                                                    className={`border-2 font-black text-xs uppercase transition-all flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 ${sizeStyle} ${colorStyle}`}
                                                >
                                                    {seat.seat_number}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="w-6 text-base font-black text-brand-primary uppercase text-center shrink-0">
                                        {rowLetter}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-6 text-[10px] md:text-xs uppercase font-black tracking-wider pt-10 border-t-2 border-neutral-900 w-full mt-10">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-black"></div><span>Regular</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 border-2 border-black"></div><span>VIP</span></div>
                        <div className="flex items-center gap-2"><div className="w-8 h-4 bg-pink-400 border-2 border-black"></div><span>Couple</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-primary border-2 border-black"></div><span>Selected</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-neutral-900 border-2 border-neutral-800 opacity-40"></div><span>Unavailable</span></div>
                    </div>
                </div>

                <div className="p-6 border-2 border-neutral-800 bg-[#121212] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_#1a1a1a]">
                    <div className="space-y-1 text-center md:text-left">
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Selected Seats Summary</span>
                        <span className="text-xl font-black text-white uppercase tracking-tight">
                            {selectedSeats.length > 0 ? selectedSeats.map(s => s.label).join(', ') : 'No Seats Chosen'}
                        </span>
                    </div>
                    <Button 
                        disabled={selectedSeats.length === 0 || lockMutation.isPending}
                        onClick={() => lockMutation.mutate(selectedSeats.map(s => s.id))}
                        className="w-full md:w-auto border-2 border-black font-black text-xs uppercase tracking-wider px-10 py-4 rounded-none bg-brand-primary text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        {lockMutation.isPending ? 'Locking Seats...' : 'Confirm Show Seats'}
                    </Button>
                </div>

            </div>
        </div>
    );
}