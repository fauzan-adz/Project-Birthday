// components/Preloader.tsx
import React from 'react';

interface PreloaderProps {
    isLoading: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
    const loaderClass = `
        fixed inset-0 z-[500] 
        flex items-center justify-center 
        bg-pink-100/90 backdrop-blur-sm 
        transition-opacity duration-700 ease-out
        ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}
    `;

    return (
        <div className={loaderClass}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-xl font-semibold text-pink-600">Tunggu ya...</p>
            </div>
        </div>
    );
};