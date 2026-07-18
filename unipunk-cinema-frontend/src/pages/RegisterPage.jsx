import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';
import { registerSchema } from '../utils/authValidation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post('/auth/register', data);
            return res.data.data;
        },
        onSuccess: () => {
            toast.success('Registrasi sukses! Silakan login.');
            navigate('/login');
        },
        onError: (error) => {
            const msg = error.response?.data?.message || 'Registrasi gagal';
            toast.error(msg);
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
            <div className="w-full max-w-md p-8 rounded-2xl border border-white/5 bg-[#0f0f0f] space-y-6 shadow-xl">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black tracking-tight text-white">Create Account</h2>
                    <p className="text-xs text-neutral-500">Daftar sekarang dan nikmati kemudahan booking tiket.</p>
                </div>
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                    <Input label="Full Name" type="text" error={errors.name?.message} {...register('name')} />
                    <Input label="Email Address" type="email" error={errors.email?.message} {...register('email')} />
                    <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
                    <Input label="Confirm Password" type="password" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
                    <Button type="submit" className="w-full py-3 mt-2 bg-brand-primary text-white font-bold" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>
                <p className="text-center text-xs text-neutral-400">
                    Sudah memiliki akun? <Link to="/login" className="text-brand-primary font-semibold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}