import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axios';
import { MovieCard } from '../ui/MovieCard';
import { MovieCardSkeleton } from '../ui/MovieCardSkeleton';
import { Button } from '../ui/Button';
import { FaqAccordion } from '../components/FaqAccordion';

export function LandingPage() {
    const [activeIndex, setActiveIndex] = useState(0);

    const { data: movies, isLoading } = useQuery({
        queryKey: ['public-movies'],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/movies');
            return res.data.data;
        }
    });

    const fallbackMovies = [
        {
            id: 1,
            title: 'Pengabdi Setan 3',
            slug: 'pengabdi-setan-3',
            rating_age: 'D17+',
            language: 'Indonesian',
            synopsis: 'Teror keluarga yang diganggu kekuatan gaib kembali menghantui dengan misteri baru.',
            banner_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600',
            poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500',
        },
        {
            id: 2,
            title: 'Spider-Man: No Way Home',
            slug: 'spiderman-no-way-home',
            rating_age: 'R13+',
            language: 'English (Sub Indo)',
            synopsis: 'Selerisque sed ultricies tristique. Mi in vivamus aliquam varius eu felis. Id ultrices diam turpis mi tincidunt. Ut morbi sed urna tempor imperdiet eu scelerisque egestas. Interdum mi orci.',
            banner_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600',
            poster_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=500',
        }
    ];

    const currentMovies = movies && movies.length > 0 ? movies : fallbackMovies;
    const activeMovie = currentMovies[activeIndex];

    const offers = [1, 2, 3, 4];

    const faqs = [
        { q: 'Bagaimana cara melakukan reservasi kursi di Unipunk Cinema?', a: 'Pilih film yang ingin Anda tonton pada halaman utama, tentukan jadwal dan studio, lalu Anda akan diarahkan ke denah kursi interaktif untuk memilih tempat duduk yang masih tersedia.' },
        { q: 'Berapa lama batas waktu pembayaran tiket setelah kursi dipilih?', a: 'Setelah Anda menekan tombol konfirmasi kursi, sistem akan mengunci kursi pilihan Anda secara otomatis selama 10 menit untuk memberi waktu proses checkout pembayaran melalui gateway Xendit.' },
        { q: 'Metode pembayaran apa saja yang didukung oleh Unipunk Cinema?', a: 'Kami mendukung penuh metode pembayaran modern terlengkap melalui gateway Xendit, meliputi QRIS, Virtual Account bank-bank ternama, E-Wallet, serta Kartu Kredit.' }
    ];

    useEffect(() => {
        if (currentMovies.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % currentMovies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [currentMovies.length]);

    return (
        <div className="bg-[#080808] min-h-screen pb-24 overflow-x-hidden">
            <section className="relative min-h-[92vh] flex items-center pt-20 overflow-hidden border-b-2 border-neutral-900">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeMovie?.id || activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.25 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 z-0"
                    >
                        <img 
                            src={activeMovie?.banner_url} 
                            alt={activeMovie?.title} 
                            className="w-full h-full object-cover scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080808] to-transparent"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-12 mt-8">
                    <div className="max-w-2xl space-y-6 w-full">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#121212] border-2 border-neutral-800 text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest">
                                ACTION
                            </span>
                            <span className="bg-[#121212] border-2 border-neutral-800 text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest">
                                HARDBALL
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.h1 
                                key={activeMovie?.title}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white uppercase break-words"
                            >
                                {activeMovie?.title}
                            </motion.h1>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.p 
                                key={activeMovie?.synopsis}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-lg"
                            >
                                {activeMovie?.synopsis}
                            </motion.p>
                        </AnimatePresence>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Button variant="primary" className="border-2 border-black font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-none bg-brand-primary text-white flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all">
                                <Ticket className="w-4 h-4" /> Book tickets
                            </Button>
                            <Button className="border-2 border-neutral-800 bg-[#121212] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-none flex items-center gap-2 hover:bg-neutral-800 transition-colors">
                                <Play className="w-4 h-4 fill-white" /> Watch trailer
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 pt-8">
                            {currentMovies.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`h-2 transition-all duration-300 rounded-none ${
                                        activeIndex === idx 
                                            ? 'w-10 bg-brand-primary border border-black' 
                                            : 'w-3 bg-neutral-800 hover:bg-neutral-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block shrink-0 z-10">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeMovie?.poster_url}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-72 aspect-[2/3] rounded-none overflow-hidden border-4 border-white shadow-[8px_8px_0px_0px_rgba(229,9,20,1)] bg-neutral-900"
                            >
                                <img src={activeMovie?.poster_url} alt="Poster" className="w-full h-full object-cover" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <section id="now-showing" className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-20 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-neutral-900 pb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Now Showing</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="bg-[#121212] border-2 border-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-none outline-hidden cursor-pointer focus:border-brand-primary transition-colors">
                            <option>All Genres</option>
                            <option>Action</option>
                            <option>Comedy</option>
                            <option>Horror</option>
                        </select>
                        <select className="bg-[#121212] border-2 border-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-none outline-hidden cursor-pointer focus:border-brand-primary transition-colors">
                            <option>All Languages</option>
                            <option>English</option>
                            <option>Indonesian</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 gap-y-12">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <MovieCardSkeleton key={i} />)
                    ) : (
                        currentMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))
                    )}
                </div>
            </section>

            <section id="offers" className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-24 space-y-10">
                <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-6">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Offers</h2>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 border-2 border-neutral-800 bg-[#121212] flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 border-2 border-neutral-800 bg-white flex items-center justify-center text-black hover:bg-neutral-200 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers.map((offer) => (
                        <div key={offer} className="p-4 bg-[#121212] border-2 border-neutral-800 shadow-[6px_6px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#E50914] transition-all duration-300 flex flex-col gap-4">
                            <div className="aspect-video w-full border-2 border-neutral-800 bg-white flex items-center justify-center overflow-hidden">
                                <div className="text-center">
                                    <span className="text-3xl font-black text-black block tracking-tighter">25% OFF</span>
                                    <span className="text-[9px] font-black text-neutral-500 tracking-widest uppercase">On Movie Tickets</span>
                                </div>
                            </div>
                            <div className="space-y-2 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-black text-sm text-white uppercase tracking-tight line-clamp-2">BCA x UNIPUNK : UPTO 25% Off</h3>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Valid only on Saturdays</p>
                                </div>
                                <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline text-left pt-2">
                                    View offer details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-24">
                <div className="w-full border-2 border-neutral-800 bg-[#121212] shadow-[8px_8px_0px_0px_#E50914] relative min-h-[300px] flex items-center p-8 md:p-16 overflow-hidden">
                    <div className="relative z-10 max-w-lg space-y-4">
                        <span className="inline-block bg-brand-primary text-white text-[9px] font-black tracking-widest px-3 py-1 uppercase">
                            Food Frenzy at Unipunk Cinema
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                            Movie <span className="text-brand-primary bg-black px-2 border border-neutral-800">Munchies:</span> Where Flavor Takes Center Stage!
                        </h2>
                        <p className="text-xs md:text-sm font-medium text-neutral-400 leading-relaxed">
                            Experience a flavor explosion with outrageous snacks and gourmet treats that elevate your movie night!
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 h-full w-1/2 opacity-20 md:opacity-40 bg-[url('https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=1000')] bg-cover bg-left border-l-2 border-neutral-900"></div>
                </div>
            </section>

            <section id="faq" className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-24 space-y-8">
                <div className="space-y-1 border-b-2 border-neutral-900 pb-6">
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">Frequently Asked Questions</h2>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Informasi mendasar seputar fungsionalitas reservasi Unipunk Cinema.</p>
                </div>
                <div className="flex flex-col">
                    {faqs.map((faq, index) => (
                        <FaqAccordion key={index} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </section>
        </div>
    );
}