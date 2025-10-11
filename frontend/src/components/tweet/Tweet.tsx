import React from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { useTweets } from '../../hooks/useTweets';

export interface TweetProps {
    id: string;
    username: string;
    handle?: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
    liked_by_me?: boolean;
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
    liked_by_me = false, // valor padrão
}: TweetProps) {
    const { likeTweet } = useTweets();
    const [localLikes, setLocalLikes] = React.useState(likes);
    const [liked, setLiked] = React.useState(liked_by_me);

    const handleLike = async () => {
        console.log('Clicou no like do tweet:', id);
        try {
        const result = await likeTweet(id);
        console.log('Resposta do backend:', result);

        if (result) {
            setLocalLikes(result.likes);
            setLiked(result.status === 'liked');
        }
        } catch (error) {
        console.error('Erro ao curtir:', error);
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
                className={`flex items-center space-x-2 ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                onClick={handleLike}
                >
                <Heart className="h-5 w-5" />
                <span>{localLikes}</span>
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




// import React from 'react';
// import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
// import { useTweets } from '../../hooks/useTweets';

// interface TweetProps {
//     id: string; // ou number se o backend usa número
//     username: string;
//     handle?: string;
//     content: string;
//     timestamp: string;
//     likes_count: number;
//     retweets_count: number;
//     replies_count: number;
//     liked_by_me: boolean; // ✅ corresponde ao serializer
// }

// export function Tweet({
//     id,
//     username,
//     handle,
//     content,
//     timestamp,
//     likes_count,
//     retweets_count,
//     replies_count,
//     liked_by_me, // ✅ recebe do backend
// }: TweetProps) {
//     const { likeTweet } = useTweets();
//     const [localLikes, setLocalLikes] = React.useState(likes_count);
//     const [liked, setLiked] = React.useState(liked_by_me); // ✅ controla cor do coração

//     const handleLike = async () => {
//         console.log("Clicou no like do tweet:", id);
//         try {
//             const result = await likeTweet(id); // chama backend
//             console.log("Resposta do backend:", result);

//             if (result) {
//                 setLocalLikes(result.likes_count);
//                 setLiked(result.status === "liked"); // muda cor do coração
//             }
//         } catch (error) {
//             console.error("Erro ao curtir:", error);
//         }
//     };

//     return (
//         <div className="border-b border-gray-800 p-4 hover:bg-gray-900/50">
//             <div className="flex space-x-4">
//                 <img
//                     src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
//                     alt={username}
//                     className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                         <span className="font-bold text-white">{username}</span>
//                         <span className="text-gray-500">@{handle}</span>
//                         <span className="text-gray-500">·</span>
//                         <span className="text-gray-500">{timestamp}</span>
//                     </div>
//                     <p className="text-white mt-2">{content}</p>
//                     <div className="flex justify-between mt-4 text-gray-500 max-w-md">
//                         <button className="flex items-center space-x-2 hover:text-blue-500">
//                             <MessageCircle className="h-5 w-5" />
//                             <span>{replies_count}</span>
//                         </button>
//                         <button className="flex items-center space-x-2 hover:text-green-500">
//                             <Repeat2 className="h-5 w-5" />
//                             <span>{retweets_count}</span>
//                         </button>
//                         <button
//                             className={`flex items-center space-x-2 ${
//                                 liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
//                             }`}
//                             onClick={() => {
//                                 alert("Botão clicado!");
//                                 handleLike();
//                             }}
//                         >
//                             <Heart className="h-5 w-5" />
//                             <span>{localLikes}</span>
//                         </button>

//                         <button className="flex items-center space-x-2 hover:text-blue-500">
//                             <Share className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React from 'react';
// import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

// interface TweetProps {
//     id: string;
//     username: string;
//     handle?: string;
//     content: string;
//     timestamp: string;
//     likes: number;
//     retweets: number;
//     replies: number;
// }

// export function Tweet({ username, handle, content, timestamp, likes, retweets, replies }: TweetProps) {
//     return (
//         <div className="border-b border-gray-800 p-4 hover:bg-gray-900/50">
//             <div className="flex space-x-4">
//                 <img
//                     src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
//                     alt={username}
//                     className="h-12 w-12 rounded-full"
//                 />
//                 <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                         <span className="font-bold text-white">{username}</span>
//                         <span className="text-gray-500">@{handle}</span>
//                         <span className="text-gray-500">·</span>
//                         <span className="text-gray-500">{timestamp}</span>
//                     </div>
//                     <p className="text-white mt-2">{content}</p>
//                     <div className="flex justify-between mt-4 text-gray-500 max-w-md">
//                         <button className="flex items-center space-x-2 hover:text-blue-500">
//                             <MessageCircle className="h-5 w-5" />
//                             <span>{replies}</span>
//                         </button>
//                         <button className="flex items-center space-x-2 hover:text-green-500">
//                             <Repeat2 className="h-5 w-5" />
//                             <span>{retweets}</span>
//                         </button>
//                         <button className="flex items-center space-x-2 hover:text-red-500">
//                             <Heart className="h-5 w-5" />
//                             <span>{likes}</span>
//                         </button>
//                         <button className="flex items-center space-x-2 hover:text-blue-500">
//                             <Share className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }