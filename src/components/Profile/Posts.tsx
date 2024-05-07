'use client'

import { useEffect, useState } from 'react';
import { useTronStore } from '@/lib/states';
import FactBox from '../FactBox';

export default function ProfilePosts({ address }: { address: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        if (kinDao?.getProposals) {
            (async() => {
                let posts_ = await kinDao.getProposals(0, 99900);
                posts_ = posts_.filter(p => p.creator === address);
                setPosts(posts_);
            })()
        }
    }, [kinDao])

    return (
        <>
            {!posts.length ? (
                <p>There are no posts has been published by {address}.</p>
            ) : (
                <div className="content">
                    {posts.map((post: any, i: number) => {
                        return (
                            <FactBox
                                key={i}
                                id={post.id}
                                title={post.title}
                                description={post.description}
                                author={post.creator}
                                bounty={post.bounty}
                                date={new Date(post.createdAt * 1000)}
                            />
                        )
                    })}
                </div>
            )}
        </>
    )
}