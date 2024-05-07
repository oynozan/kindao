import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { formatDate, truncateWalletAddress } from "@/lib/helpers";

export default function AnswerSection({
    id,
    answer,
    author,
    votes,
    approved,
    date
} : {
    id: string,
    answer: string,
    author: string,
    votes: number,
    approved: boolean,
    date: Date,
}) {
    return (
        <div id={id} className="answer-section">
            <div
                className={"votes " + (votes > 0 ? "positive" : (votes < 0 ? "negative" : "zero"))}
            >
                <div>
                    <div className="approval">{approved && (<FaCheck />)}</div>
                    <FaCaretUp />
                    <span>{votes}</span>
                    <FaCaretDown />
                </div>
            </div>
            <div className="content">
                <p className="answer" dangerouslySetInnerHTML={{ __html: answer || "" }}></p>

                <div className="bottom">
                    <p className="date">{formatDate(date)}</p>
                    <Link
                        href={`/profile/${author}`}
                        className="author"
                    >
                        {truncateWalletAddress(author)}
                    </Link>
                </div>
            </div>
        </div>
    )
}