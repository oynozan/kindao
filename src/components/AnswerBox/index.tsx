/**
 * Box components that will be shown in home page
 * A summary of fact that needs to be checked is placed in this box
 */

import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { FaCheck } from "react-icons/fa";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { formatDate, truncateWalletAddress } from "@/lib/helpers";

import './answerbox.scss';

export default function AnswerBox({
    id,
    post,
    answer,
    author,
    votes,
    approved,
    date
} : {
    id: string,
    post: string,
    answer: string,
    author: string,
    votes: number,
    approved: boolean,
    date: Date
}) {
    return (
        <Link
            href={`/proposal/${post}#${id}`}
            className={"answer-box " + (approved ? "approved" : "")}
        >
            <div
                className={"top " + (votes > 0 ? "positive" : (votes < 0 ? "negative" : "zero"))}
            >
                <p>{votes} {votes >= 0 ? <FaCaretUp /> : <FaCaretDown />}</p>
                <div className="approval">{approved && (<FaCheck />)}</div>
            </div>

            <p
                className="answer"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer || "") }}
            ></p>

            <div className="bottom">
                <p className="date">{formatDate(date)}</p>
                <p className="author">{truncateWalletAddress(author)}</p>
            </div>
        </Link>
    )
}