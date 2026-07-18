import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export function AppProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-black text-white border border-neutral-800 rounded-xl',
                    duration: 4000,
                    style: {
                        background: '#000000',
                        color: '#ffffff',
                    },
                }}
            />
        </QueryClientProvider>
    );
}