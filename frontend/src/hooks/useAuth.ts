// src/hooks/useAuth.ts
import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    isAuthenticated: false,
    token: localStorage.getItem('authToken'),

    login: async (email: string, password: string) => {
        try {
        const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            console.error('Erro no login:', errorText);
            throw new Error('Falha no login');
        }

        const data = await resp.json();
        localStorage.setItem('authToken', data.access);
        set({ isAuthenticated: true, token: data.access });
        } catch (error) {
        console.error('Erro ao fazer login:', error);
        set({ isAuthenticated: false, token: null });
        }
    },

    signup: async (email: string, password: string, passwordConfirmation: string) => {
        try {
        const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email,
            password,
            password_confirmation: passwordConfirmation,
            }),
        });

        if (!resp.ok) {
            const errorData = await resp.text();
            console.error('Erro no signup:', errorData);
            throw new Error('Falha no cadastro');
        }

        await resp.json();
        // login automático após o cadastro bem-sucedido
        await useAuth.getState().login(email, password);
        } catch (error) {
        console.error('Erro ao fazer cadastro:', error);
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        set({ isAuthenticated: false, token: null });
        window.location.href = '/login';
    },

    restoreSession: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
        set({ isAuthenticated: true, token });
        } else {
        set({ isAuthenticated: false, token: null });
        }
    },
}));
