'use client'

import { useAnswerStore } from "@/lib/states";
import Answer from "@/actions/answer";
import Editor from "../Editor";
import Button from "../Button";

export default function Write({ id } : { id: string }) {

    const setAnswer = useAnswerStore(state => state.setContent);

    return (
        <div className="enter-answer">
            <Editor set={setAnswer} />
            <Button type="main" click={() => Answer(id)}>Answer</Button>
        </div>
    )
}