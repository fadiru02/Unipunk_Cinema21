import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function FaqAccordion({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-2 border-neutral-800 bg-[#121212] transition-all duration-300 shadow-[4px_4px_0px_0px_#1a1a1a] mb-4 last:mb-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full p-5 flex items-center justify-between text-left font-black text-xs md:text-sm uppercase tracking-wider text-white hover:text-brand-primary transition-colors focus:outline-hidden"
            >
                <span>{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.3 }, opacity: { duration: 0.25 } } }}
                        exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } } }}
                        className="overflow-hidden border-t-2 border-neutral-800 bg-[#0d0d0d]"
                    >
                        <p className="p-5 text-xs text-neutral-400 font-medium leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}