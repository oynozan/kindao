import Link from "next/link";
import { FaAward } from "react-icons/fa";
import { notFound } from "next/navigation";

import { questions } from "@/data/dummy/questions";
import { answers as answer_data } from "@/data/dummy/answers";
import { formatDate, truncateWalletAddress } from "@/lib/helpers";
import AnswerSection from "@/components/Answers/Answer";
import Write from "@/components/Answers/Write";

import './post.scss';

export default function PostLayout({
    params
} : {
    params: { id: string }
}) {

    const postID = params.id;

    // Get the post via its ID
    const post = questions.filter(q => q.id === postID)[0];

    // Get answers
    const answers = answer_data.filter(a => a.post === postID);

    if (!post) return notFound();

    return (
        <div id="post-container">
            <div id="post">
                <div className="info">
                    <h1>{post.title}</h1>
                    <div className="bounty">{post.bounty.toFixed(2)}<FaAward /></div>
                </div>

                <p>{post.description}</p>

                <div className="bottom">
                    <p className="date">{formatDate(post.date)}</p>
                    <Link
                        href={`/profile/${post.author}`}
                        className="author"
                    >
                        {truncateWalletAddress(post.author)}
                    </Link>
                </div>
            </div>

            {/* Answers */}
            <div id="answers">
                <div className="list">
                    { !answers?.length && (<p>No answers yet, be the first one!</p>) }
                    { answers.map((answer, i) => {
                        return (
                            <AnswerSection
                                key={i}
                                id={answer.id}
                                answer={answer.content}
                                author={answer.author}
                                votes={answer.votes}
                                approved={answer.approved}
                                date={answer.date}
                            />
                        )
                    }) }
                </div>
            </div>

            <div className="write-answer">
                <Write id={postID} />
            </div>
        </div>
    )
}