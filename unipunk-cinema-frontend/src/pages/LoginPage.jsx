import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            localStorage.setItem('auth_token', res.data.data.token);
            toast.success('Login berhasil!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login gagal.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#080808] min-h-screen flex items-center justify-center p-6 text-white">
            <div className="w-full max-w-md bg-[#121212] border-2 border-neutral-800 p-8 shadow-[8px_8px_0px_0px_#E50914]">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Login</h1>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">Masuk ke akun Unipunk kamu</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#080808] border-2 border-neutral-800 px-4 py-3 text-sm font-bold outline-hidden focus:border-brand-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#080808] border-2 border-neutral-800 px-4 py-3 text-sm font-bold outline-hidden focus:border-brand-primary transition-colors"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full border-2 border-black font-black text-xs uppercase tracking-wider py-4 bg-brand-primary text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all"
                    >
                        {isLoading ? 'Processing...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}