'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

const LoginForm = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const correctPassword = process.env.NEXT_PUBLIC_CMS_PASSWORD;
        if (!correctPassword) {
            setError('CMS password is not configured on the server.');
            return;
        }
        if (password === correctPassword) {
            onAuthenticated();
        } else {
            setError('Incorrect password.');
        }
    };
    return (
        <div className="w-full flex items-center justify-center pt-20">
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="bg-[#2b3341] p-8 rounded-lg shadow-lg">
                    <h1 className="text-white text-2xl mb-6 text-center font-bold">CMS Access</h1>
                    {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
                    <div className="mb-4">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" placeholder="Password" autoFocus />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleAuthentication = () => {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAdminAuthenticated');
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {isAuthenticated && <AdminSidebar onSignOut={handleSignOut} />}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {isAuthenticated ? children : <LoginForm onAuthenticated={handleAuthentication} />}
            </main>
        </div>
    );
}