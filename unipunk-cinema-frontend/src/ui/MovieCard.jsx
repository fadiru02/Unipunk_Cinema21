import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MovieCard({ movie }) {
    return (
        <motion.div 
            whileHover={{ y: -6, x: -6 }}
            className="group relative bg-[#121212] border-2 border-neutral-800 rounded-none p-3 flex flex-col gap-4 shadow-[6px_6px_0px_0px_#1a1a1a] hover:shadow-[12px_12px_0px_0px_#E50914] transition-all duration-300"
        >
            <Link to={`/movies/${movie.slug}`} className="relative aspect-[2/3] w-full overflow-hidden border-2 border-neutral-800 bg-neutral-900 block">
                <img 
                    src={movie.poster_url} 
                    alt={movie.title}
                    className="h-full w-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black border-2 border-neutral-800 px-2 py-0.5 flex items-center gap-1 font-black">
                    <span className="text-[10px] text-white">8.5</span>
                    <Star className="w-3 h-3 text-brand-primary fill-brand-primary" />
                </div>
            </Link>
            
            <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-black tracking-widest text-neutral-400 uppercase">
                        <span className="text-brand-primary border border-brand-primary px-1">{movie.rating_age}</span>
                        <span>•</span>
                        <span>Action</span>
                        <span>•</span>
                        <span>Sci-Fi</span>
                    </div>
                    <h3 className="font-black text-sm text-white uppercase tracking-tight line-clamp-1 group-hover:text-brand-primary transition-colors duration-300">
                        {movie.title}
                    </h3>
                </div>
                <p className="text-[10px] uppercase font-black tracking-wider text-neutral-500">
                    {movie.language}
                </p>
            </div>
        </motion.div>
    );
}