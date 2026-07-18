import React from 'react';

export function MovieCardSkeleton() {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="aspect-[2/3] w-full bg-neutral-200 rounded-2xl"></div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
        </div>
    );
}