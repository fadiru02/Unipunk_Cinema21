import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = 'px-6 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm tracking-wide';
    
    const variants = {
        primary: 'bg-brand-primary text-white hover:bg-brand-accent shadow-md shadow-brand-primary/20',
        secondary: 'bg-brand-secondary text-white hover:bg-neutral-900 border border-neutral-800',
        glass: 'bg-white/10 text-brand-secondary backdrop-blur-md border border-white/20 hover:bg-white/20',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}