'use client'

import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';
import { Fact } from '@/lib/kindao';

import AnswerSection from "@/components/Answers/Answer";

export default function AnswerList({ id } : { id: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [facts, setFacts] = useState<Fact[]>([]);

    useEffect(() => {
        if (kinDao) {
            (async() => {
                const proposal = await kinDao.getProposal(id);
                if (proposal)  {
                    setFacts(await kinDao.getFacts(id));
                }
            })()
        }
    }, [kinDao])

    return (
        <div className="list">
            { !facts?.length && (<p>No answers yet, be the first one!</p>) }
            { facts.map((fact, i) => {
                return (
                    <AnswerSection
                        key={i}
                        id={fact.id}
                        answer={fact.description}
                        author={fact.creator}
                        votes={5} // TODO: check it
                        approved={fact.approved}
                        date={new Date(fact.createdAt)}
                    />
                )
            }) }
        </div>
    )
}