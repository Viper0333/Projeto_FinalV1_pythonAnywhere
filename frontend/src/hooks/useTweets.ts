import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Tweet {
    id: string;
    username: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
}

export function useTweets() {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [reloadKey, setReloadKey] = useState(0); // Força uma atualização
    const { token } = useAuth();

    const fetchTweets = useCallback(async () => {
        if (!token) {
            console.warn("Token não encontrado. Não será possível buscar tweets.");
            return;
        }

        try {
            console.log("Iniciando busca por tweets...");
            const response = await fetch('https://alexalexandre.pythonanywhere.com/api/tweets/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Erro ao buscar tweets');
            const data = await response.json();
            console.log("Tweets recebidos:", data);
            setTweets(data);
        } catch (error) {
            console.error("Erro ao buscar tweets:", error);
        }
    }, [token]);

    // Use reloadKey para forçar re-renderização
    useEffect(() => {
        fetchTweets();
    }, [fetchTweets, reloadKey]);

    const reloadTweets = () => {
        setReloadKey((prev) => prev + 1); // Incrementa para forçar atualização
    };

    return { tweets, setTweets, fetchTweets, reloadTweets };
}
