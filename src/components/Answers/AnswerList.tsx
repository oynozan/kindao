'use client'

import { useTronStore } from '@/lib/states';
import { useEffect, useState } from 'react';
import { Fact } from '@/lib/kindao';

import AnswerSection from "@/components/Answers/Answer";

export default function AnswerList({ id } : { id: string }) {

    const kinDao = useTronStore(state => state.kinDao);
    const [facts, setFacts] = useState<Fact[]>([]);

    useEffect(() => {
        if (kinDao?.getFacts) {
            (async() => {
                const facts = await kinDao.getFacts(id);
                setFacts(facts?.length ? facts : []);
            })()
        }
    }, [kinDao])

    return (
        <div className="list">
            { !facts?.length && (
                <>
                    <br />
                    <p>No answers yet, be the first one!</p>
                    <br />
                </>
            )}
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