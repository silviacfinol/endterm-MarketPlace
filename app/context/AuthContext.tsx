'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

//==============================
//   Data types (Auth state)
//==============================

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string; 
    gender: string;
    image: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

//==============================
//        Inicial state
//==============================

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

//==============================
// Actions supported by Reducer
//==============================

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string} }
    | { type: 'LOGOUT' };

//==============================
//       Reducer function
//==============================

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                user: null,
                token: null,
            };
        default:
            return state;
    }
}

//==============================
//      Context interface
//==============================

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

//==============================
//       Auth Provider
//==============================

export function AuthProvider({ children }: { children: ReactNode}) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const logout = () => {
        dispatch({ type: 'LOGOUT'});
    };

    return (
        <AuthContext.Provider value={{ state, dispatch, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

//==============================
// Custom Hook for Client Comp
//==============================

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error ('useAuth must be use in AuthProvider');
    }
    return context;
}
