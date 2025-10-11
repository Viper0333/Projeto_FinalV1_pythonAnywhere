import { useState, useEffect, useCallback } from "react";

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
    const [reloadKey, setReloadKey] = useState(0);

    // ============================
    // 🔹 Buscar Tweets
    // ============================
    const fetchTweets = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.warn("Token não encontrado. Não será possível buscar tweets.");
            return;
        }

        try {
            console.log("Iniciando busca por tweets...");
            const response = await fetch("http://127.0.0.1:8000/api/tweets/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Erro ao buscar tweets");
            const data = await response.json();
            console.log("Tweets recebidos:", data);
            setTweets(data);
        } catch (error) {
            console.error("Erro ao buscar tweets:", error);
        }
    }, []);

    useEffect(() => {
        fetchTweets();
    }, [fetchTweets, reloadKey]);

    // ============================
    // 🔹 Recarregar Tweets
    // ============================
    const reloadTweets = () => {
        setReloadKey((prev) => prev + 1);
    };

    // ============================
    // 🔹 Curtir / Descurtir Tweet
    // ============================
    const likeTweet = async (id: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.warn("Token ausente — não é possível curtir tweet.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tweets/${id}/like/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Erro no like:", errText);
                throw new Error("Falha ao curtir/descurtir tweet");
            }

            const data = await response.json();
            console.log("Resposta do like:", data);

            setTweets((prev) =>
                prev.map((tweet) =>
                    tweet.id === id
                        ? { ...tweet, likes: data.likes_count ?? tweet.likes }
                        : tweet
                )
            );

            return data;
        } catch (error) {
            console.error("Erro ao curtir tweet:", error);
        }
    };

    return { tweets, setTweets, fetchTweets, reloadTweets, likeTweet };
}




// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from './useAuth';

// interface Tweet {
//     id: string;
//     username: string;
//     content: string;
//     timestamp: string;
//     likes: number;
//     retweets: number;
//     replies: number;
// }

// export function useTweets() {
//     const [tweets, setTweets] = useState<Tweet[]>([]);
//     const [reloadKey, setReloadKey] = useState(0); // Força uma atualização
//     const { token } = useAuth();

//     const fetchTweets = useCallback(async () => {
//         if (!token) {
//             console.warn("Token não encontrado. Não será possível buscar tweets.");
//             return;
//         }

//         try {
//             console.log("Iniciando busca por tweets...");
//             const response = await fetch('https://diegocavalcantidev.pythonanywhere.com/api/tweets/', {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) throw new Error('Erro ao buscar tweets');
//             const data = await response.json();
//             console.log("Tweets recebidos:", data);
//             setTweets(data);
//         } catch (error) {
//             console.error("Erro ao buscar tweets:", error);
//         }
//     }, [token]);

//     // Use reloadKey para forçar re-renderização
//     useEffect(() => {
//         fetchTweets();
//     }, [fetchTweets, reloadKey]);

//     const reloadTweets = () => {
//         setReloadKey((prev) => prev + 1); // Incrementa para forçar atualização
//     };

//     return { tweets, setTweets, fetchTweets, reloadTweets };
// }
