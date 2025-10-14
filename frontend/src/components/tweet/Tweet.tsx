import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // importe seu hook

interface TweetProps {
    id: string;
    username: string;
    handle?: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
    liked?: boolean;
}

export function Tweet({
    id,
    username,
    handle,
    content,
    timestamp,
    likes,
    retweets,
    replies,
    liked: initialLiked = false
}: TweetProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(likes);
    const { token } = useAuth();

    const handleLike = async () => {
        if (!token) {
        console.warn('Usuário não autenticado.');
        return;
        }

        try {
        const response = await fetch(`https://alexalexandre.pythonanywhere.com/api/tweets/${id}/like_tweet/`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`, // JWT
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.total_likes);
        } catch (error) {
        console.error('Erro ao curtir/descurtir tweet', error);
        }
    };

    return (
        <div className="border-b border-gray-800 p-4 hover:bg-gray-900/50">
        <div className="flex space-x-4">
            <img
            src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
            alt={username}
            className="h-12 w-12 rounded-full"
            />
            <div className="flex-1">
            <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{username}</span>
                <span className="text-gray-500">@{handle}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{timestamp}</span>
            </div>

            <p className="text-white mt-2">{content}</p>

            <div className="flex justify-between mt-4 text-gray-500 max-w-md">
                <button className="flex items-center space-x-2 hover:text-blue-500">
                <MessageCircle className="h-5 w-5" />
                <span>{replies}</span>
                </button>

                <button className="flex items-center space-x-2 hover:text-green-500">
                <Repeat2 className="h-5 w-5" />
                <span>{retweets}</span>
                </button>

                <button
                className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
                onClick={handleLike}
                >
                <Heart className="h-5 w-5" />
                <span>{likeCount}</span>
                </button>

                <button className="flex items-center space-x-2 hover:text-blue-500">
                <Share className="h-5 w-5" />
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
