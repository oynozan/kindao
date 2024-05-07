'use client'

import { useEffect, useState } from 'react';
import { useTronStore } from '@/lib/states';
import AnswerBox from '../AnswerBox';

export default function ProfileFacts({ address }: { address: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [answers, setAnswers] = useState<any[]>([]);

    useEffect(() => {
        if (kinDao?.getFacts && kinDao?.getProposals) {
            (async() => {
                let posts_ = await kinDao.getProposals(0, 99900);

                const total = [];
                let facts_;

                for (let p of posts_) {
                    facts_ = await kinDao.getFacts(p.id, 0, 99900);
                    facts_ = facts_.filter(f => f.creator === address)?.[0];
                    if (!facts_) continue;
                    total.push({ ...facts_, votes: facts_.voteUp - facts_.voteDown, post: p.id });
                }

                setAnswers(total);
            })()
        }
    }, [kinDao])

    return (
        <>
            {!answers.length ? (
                <p>There are no answers has been published by you.</p>
            ) : (
                <div className="content">
                    {answers.map((answer: any, i: number) => {
                        return (
                            <AnswerBox
                                key={i}
                                id={answer.id}
                                post={answer.post}
                                answer={answer.title}
                                author={answer.creator}
                                votes={answer.votes}
                                approved={answer.isFinalized}
                                date={new Date(answer.createdAt * 1000)}
                            />
                        )
                    })}
                </div>
            )}
        </>
    )
}