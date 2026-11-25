'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

//==============================
// Interface for Login Response
//==============================

interface LoginResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken?: string;
    token?: string;
    message?: string;
}

export default function LoginPage() {
    const [userInput, setUserInput] = useState('emilys');
    const [passwordInput, setPasswordInput] = useState('emilyspass');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { dispatch } = useAuth();
    const router = useRouter();

    //Event handler for form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userInput,
                    password: passwordInput,
                }),
            }); 

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            // Obtain token DummyJSON
            const token = data.token || data.accessToken;

            if (!token) {
                throw new Error('Login response did not include an authentication token');
            }

            //dispatch the login success action to update the auth state
            dispatch ({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: data,
                    token: token,
                },
            });

            router.push('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Unknown error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    //render 
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">Login</h1>

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    </div>
    );
}

