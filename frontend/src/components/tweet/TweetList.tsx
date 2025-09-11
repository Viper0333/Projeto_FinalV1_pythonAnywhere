import React, { useEffect } from 'react';
import { Tweet } from './Tweet';
import { useTweets } from '../../hooks/useTweets';

export function TweetList() {
    const { tweets } = useTweets();

    useEffect(() => {
        console.log("Tweets renderizados:", tweets);
    }, [tweets]);

    return (
        <div>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </div>
    );
}
