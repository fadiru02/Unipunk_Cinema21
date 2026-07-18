import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, MapPin, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../hooks/useAuth';

export function MainLayout() {
    const { isAuthenticated, user, logout, isLoggingOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans antialiased">
            <header className="fixed top-0 inset-x-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b-2 border-neutral-900 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-brand-primary border-2 border-black flex items-center justify-center font-black text-black transform group-hover:rotate-6 transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            U
                        </div>
                        <span className="text-brand-primary font-black text-xl tracking-tighter uppercase">
                            Unipunk<span className="text-white font-light tracking-normal lowercase pl-1">cinema</span>
                        </span>
                    </Link>
                    
                    <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-black text-neutral-400">
                        <Link to="/" className="text-white border-b-2 border-brand-primary pb-1">Home</Link>
                        <a href="#offers" className="hover:text-white transition-colors">Offers</a>
                        <a href="#now-showing" className="hover:text-white transition-colors">Show Timings</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-neutral-400 hover:text-white border-2 border-neutral-800 bg-[#121212] transition-colors rounded-none">
                            <Search className="w-4 h-4" />
                        </button>
                        
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 border-2 border-black bg-brand-primary flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] transition-all"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                                
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-4 w-56 bg-[#121212] border-2 border-neutral-800 shadow-[6px_6px_0px_0px_#E50914] flex flex-col z-50"
                                        >
                                            <div className="p-4 border-b-2 border-neutral-800">
                                                <p className="text-xs font-black uppercase text-white truncate">{user?.name}</p>
                                                <p className="text-[10px] font-bold text-neutral-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="p-2 flex flex-col gap-1">
                                                <Link 
                                                    to="/dashboard"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link 
                                                    to="/profile"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                                                >
                                                    <User className="w-4 h-4" /> Profile
                                                </Link>
                                                <button 
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        logout();
                                                    }}
                                                    disabled={isLoggingOut}
                                                    className="flex items-center w-full text-left gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-brand-primary hover:bg-brand-primary/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Logging out...' : 'Logout'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" className="border-2 border-black font-black text-xs uppercase tracking-wider px-6 py-2 rounded-none bg-brand-primary hover:bg-brand-accent transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
}