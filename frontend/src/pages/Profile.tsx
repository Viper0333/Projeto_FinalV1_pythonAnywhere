import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
    const { token } = useAuth();
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            if (!token) return;
            const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/profile/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await resp.json();
            setEmail(data.email);
            setBio(data.bio || '');
        }
        fetchProfile();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('bio', bio);
        if (password) formData.append('password', password);
        if (avatar) formData.append('avatar', avatar);

        const resp = await fetch('https://alexalexandre.pythonanywhere.com/api/users/profile/', {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (resp.ok) {
            setMessage('Perfil atualizado com sucesso!');
        } else {
            const data = await resp.json();
            setMessage('Erro: ' + JSON.stringify(data));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h2>Meu Perfil</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <input type="email" value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E-mail"/>
                
                <textarea value={bio} 
                onChange={e => setBio(e.target.value)} 
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Bio"/>

                <input type="password" placeholder="Nova senha" value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-64 max-w-full p-2 rounded-lg border border-gray-400 text-black bg-white"/>

                <input type="file" 
                onChange={e => setAvatar(e.target.files ? e.target.files[0] : null)} className="w-full text-black"/>

                <button type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-300">Salvar</button>
            </form>
        </div>
    );
}
