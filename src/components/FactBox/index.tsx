/**
 * Box components that will be shown in home page
 * A summary of fact that needs to be checked is placed in this box
 */

import Link from "next/link";
import { FaAward } from "react-icons/fa";
import { formatDate, truncateWalletAddress } from "@/lib/helpers";

import './factbox.scss';

export default function FactBox({
    id,
    title,
    description,
    author,
    bounty,
    date
} : {
    id: string,
    title: string,
    description: string,
    author: string,
    bounty: number,
    date: Date
}) {
    return (
        <Link href={`/proposal/${id}`} className="fact-box">
            <div className="info">
                <h3>{title}</h3>
                <div className="bounty">{bounty.toFixed(2)}<FaAward /></div>
            </div>

            <p>{description}</p>

            <div className="bottom">
                <p className="date">{formatDate(date)}</p>
                <p className="author">{truncateWalletAddress(author)}</p>
            </div>
        </Link>
    )
}