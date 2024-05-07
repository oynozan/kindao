import { notFound } from "next/navigation";

import AnswerList from "@/components/Answers/AnswerList";
import Write from "@/components/Answers/Write";
import PostComponent from "@/components/Post";

import './post.scss';

export default function ProposalPage({
    params
} : {
    params: { id: string }
}) {

    const proposalId = params.id;

    if (!proposalId) return notFound();

    return (
        <div id="post-container">
            <PostComponent id={proposalId} />

            {/* Answers */}
            <div id="answers">
                <AnswerList id={proposalId} />
            </div>

            <div className="write-answer">
                <Write id={proposalId} />
            </div>
        </div>
    )
}