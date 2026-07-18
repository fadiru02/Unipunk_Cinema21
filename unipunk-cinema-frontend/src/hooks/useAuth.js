import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

export function useAuth() {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('auth_token');

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const res = await axiosInstance.get('/auth/me');
            return res.data.data;
        },
        enabled: !!token,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            return await axiosInstance.post('/auth/logout');
        },
        onSettled: () => {
            localStorage.removeItem('auth_token');
            queryClient.clear();
            toast.success('Berhasil logout');
            window.location.href = '/';
        }
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user && !isError,
        logout: () => logoutMutation.mutate(),
        isLoggingOut: logoutMutation.isPending
    };
}