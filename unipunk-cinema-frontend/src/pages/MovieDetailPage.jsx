import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Globe, Subtitles, Ticket, Calendar as CalcIcon } from 'lucide-react';
import axiosInstance from '../api/axios';
import { Button } from '../ui/Button';

export function MovieDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);

    const { data: movie, isLoading: isMovieLoading } = useQuery({
        queryKey: ['movie-detail', slug],
        queryFn: async () => {
            const res = await axiosInstance.get(`/user/movies/${slug}`);
            return res.data.data;
        }
    });

    const { data: schedules, isLoading: isSchedulesLoading } = useQuery({
        queryKey: ['movie-schedules', slug],
        queryFn: async () => {
            const res = await axiosInstance.get(`/user/movies/${slug}/schedules`);
            return res.data.data;
        }
    });

    const uniqueDates = schedules 
        ? [...new Set(schedules.map(s => s.start_date))].sort() 
        : [];

    if (uniqueDates.length > 0 && !selectedDate) {
        setSelectedDate(uniqueDates[0]);
    }

    const filteredSchedules = schedules
        ? schedules.filter(s => s.start_date === selectedDate)
        : [];

    const handleBookingRedirect = () => {
        if (!selectedScheduleId) return;
        navigate(`/booking/${selectedScheduleId}`);
    };

    if (isMovieLoading || isSchedulesLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-24 space-y-8 animate-pulse">
                <div className="h-[400px] bg-neutral-900 border-2 border-neutral-800 w-full"></div>
                <div className="h-10 bg-neutral-900 border-2 border-neutral-800 w-1/3"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#080808] min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-12">
                <section className="relative w-full border-2 border-neutral-800 bg-[#121212] p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-end justify-between overflow-hidden shadow-[6px_6px_0px_0px_#1a1a1a]">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={movie?.banner_url} 
                            alt={movie?.title} 
                            className="w-full h-full object-cover opacity-15 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
                        <div className="w-52 aspect-[2/3] overflow-hidden border-4 border-white shadow-[6px_6px_0px_0px_#E50914] bg-neutral-900 shrink-0">
                            <img src={movie?.poster_url} alt={movie?.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-4 text-center md:text-left w-full">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="bg-brand-primary border-2 border-black text-white text-[10px] font-black px-3 py-0.5 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                                    {movie?.rating_age}
                                </span>
                                {movie?.genres?.map((genre) => (
                                    <span key={genre.id} className="bg-neutral-900 border-2 border-neutral-800 text-neutral-400 text-[10px] font-black px-3 py-0.5 uppercase tracking-wider">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none text-white">
                                {movie?.title}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[11px] uppercase font-black tracking-wider text-neutral-400">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-primary" /> {movie?.duration} Mins</span>
                                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-brand-primary" /> {movie?.language}</span>
                                <span className="flex items-center gap-1.5"><Subtitles className="w-4 h-4 text-brand-primary" /> {movie?.subtitle || '-'}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="p-6 md:p-8 bg-[#121212] border-2 border-neutral-800 shadow-[6px_6px_0px_0px_#1a1a1a] space-y-6">
                            <h2 className="text-lg font-black uppercase tracking-tight text-white border-b-2 border-neutral-800 pb-3">Select Showtimes</h2>
                            
                            {uniqueDates.length > 0 ? (
                                <div className="flex flex-wrap gap-3 border-b-2 border-neutral-800 pb-4">
                                    {uniqueDates.map((dateStr) => {
                                        const dateObj = new Date(dateStr);
                                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                        const dayNum = dateObj.getDate();
                                        
                                        return (
                                            <button
                                                key={dateStr}
                                                onClick={() => {
                                                    setSelectedDate(dateStr);
                                                    setSelectedScheduleId(null);
                                                }}
                                                className={`p-3 border-2 font-black text-xs uppercase tracking-wider transition-all rounded-none flex flex-col items-center min-w-[70px] ${
                                                    selectedDate === dateStr
                                                        ? 'bg-brand-primary border-black text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
                                                        : 'bg-[#080808] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                                                }`}
                                            >
                                                <span>{dayName}</span>
                                                <span className="text-lg mt-0.5">{dayNum}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : null}

                            {filteredSchedules.length === 0 ? (
                                <p className="text-xs text-neutral-500 uppercase font-black tracking-wider">Belum ada jadwal tayang yang tersedia.</p>
                            ) : (
                                <div className="space-y-6 pt-2">
                                    {filteredSchedules.map((sched) => (
                                        <div key={sched.id} className="p-5 bg-[#080808] border-2 border-neutral-800 shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block">{sched.studio.name}</span>
                                                <div className="flex items-center gap-2 text-sm text-white font-black uppercase tracking-wide">
                                                    <span className="text-neutral-400">{sched.start_date}</span>
                                                    <span>•</span>
                                                    <span className="text-brand-primary bg-black border border-neutral-800 px-2 py-0.5">{sched.start_time} WIB</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-6">
                                                <span className="text-base font-black text-white tracking-tight">Rp {sched.price.toLocaleString('id-ID')}</span>
                                                <button 
                                                    onClick={() => setSelectedScheduleId(sched.id)}
                                                    className={`border-2 font-black text-xs uppercase tracking-wider px-5 py-2.5 transition-all rounded-none ${
                                                        selectedScheduleId === sched.id 
                                                            ? 'bg-white border-black text-black shadow-[2px_2px_0px_0px_#E50914]' 
                                                            : 'bg-[#121212] border-neutral-800 text-white hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    {selectedScheduleId === sched.id ? 'Selected' : 'Choose'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 md:p-8 bg-[#121212] border-2 border-neutral-800 shadow-[6px_6px_0px_0px_#1a1a1a] space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-tight text-white border-b-2 border-neutral-800 pb-3">Synopsis</h2>
                            <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed">
                                {movie?.synopsis}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-[#121212] border-2 border-neutral-800 shadow-[6px_6px_0px_0px_#E50914] space-y-6">
                            <div className="space-y-2 border-b-2 border-neutral-800 pb-4">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Booking Summary</span>
                                <p className="text-xs font-medium text-neutral-400 leading-relaxed">
                                    Silakan pilih salah satu hari dan jam tayang aktif di sebelah kiri untuk membuka modul konfirmasi pemesanan kursi bioskop.
</p>
                            </div>
                            <Button 
                                variant="primary" 
                                className="w-full border-2 border-black font-black text-xs uppercase tracking-wider py-3.5 rounded-none bg-brand-primary text-white flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all" 
                                disabled={!selectedScheduleId}
                                onClick={handleBookingRedirect}
                            >
                                <Ticket className="w-4 h-4" /> Continue to Seats
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}