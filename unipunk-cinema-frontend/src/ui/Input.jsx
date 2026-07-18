import React from 'react';

export function Input({ label, error, ...props }) {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-xs font-semibold text-neutral-600 tracking-wide uppercase">{label}</label>}
            <input
                className={`w-full px-4 py-3 rounded-xl border bg-neutral-50 text-sm transition-all duration-300 focus:outline-hidden focus:bg-white ${
                    error 
                        ? 'border-brand-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20' 
                        : 'border-neutral-200 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/10'
                }`}
                {...props}
            />
            {error && <p className="text-xs font-medium text-brand-primary mt-1">{error}</p>}
        </div>
    );
}