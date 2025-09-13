import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken'),
    
    login: async (email, password) => {
        try {
        const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!resp.ok) throw new Error('Falha no login');

        const data = await resp.json();
        localStorage.setItem('authToken', data.access);
        set({ isAuthenticated: true, token: data.access });
        } catch (error) {
        console.error('Erro ao fazer login:', error);
        set({ isAuthenticated: false, token: null });
        }
    },

    signup: async (name, email, password) => {
        try {
        const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, bio: "", avatar: null }),
        });

        if (!resp.ok) throw new Error('Falha no cadastro');

        await useAuth.getState().login(email, password); // login automático após signup
        } catch (error) {
        console.error('Erro ao fazer cadastro:', error);
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        set({ isAuthenticated: false, token: null });
        window.location.href = '/login'; // redireciona para login
    },

    restoreSession: () => {
        const token = localStorage.getItem('authToken');
        set({ isAuthenticated: !!token, token });
    },
}));



// import { create } from 'zustand';

// interface AuthState {
//     isAuthenticated: boolean;
//     token: string | null;
//     login: (email: string, password: string) => Promise<void>;
//     signup: (name: string, email: string, password: string) => Promise<void>;
//     logout: () => void;
//     restoreSession: () => void;
// }

// export const useAuth = create<AuthState>((set) => ({
//     isAuthenticated: false,
//     token: localStorage.getItem('authToken'), // Carrega o token do localStorage no início
//     login: async (email, password) => {
//         try {
//             const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/token/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password }),
//             });
//             if (!resp.ok) {
//                 throw new Error('Falha no login');
//             }
//             const data = await resp.json();
//             localStorage.setItem('authToken', data.access); // Salva o token no localStorage
//             set({ isAuthenticated: true, token: data.access });
//         } catch (error) {
//             console.error('Erro ao fazer login:', error);
//             set({ isAuthenticated: false, token: null });
//         }
//     },
//     signup: async (name, email, password) => {
//         try {
//             const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/signup/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email,
//                     password,
//                     bio: "",
//                     avatar: null,
//                 }),
//             });
//             if (!resp.ok) {
//                 throw new Error('Falha no cadastro');
//             }
//             await resp.json();
//             await useAuth.getState().login(email, password); // Faz login automaticamente após o cadastro
//         } catch (error) {
//             console.error('Erro ao fazer cadastro:', error);
//         }
//     },
//     logout: () => {
//         localStorage.removeItem('authToken'); // Remove o token do localStorage
//         set({ isAuthenticated: false, token: null });
//         window.location.href = '/login'; // Redireciona para a página de login
//     },
//     restoreSession: () => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             set({ isAuthenticated: true, token });
//         } else {
//             set({ isAuthenticated: false, token: null });
//         }
//     },
// }));
