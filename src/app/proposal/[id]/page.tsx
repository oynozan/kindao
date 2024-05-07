import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import Write from "@/components/Answers/Write";

import './post.scss';

const AnswerList = dynamic(() => import('@/components/Answers/AnswerList'), {
    ssr: false
});

const PostComponent = dynamic(() => import('@/components/Post'), {
    ssr: false
});

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