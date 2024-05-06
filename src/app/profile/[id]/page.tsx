import { FaAward } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";

import { questions } from "@/data/dummy/questions";
import { answers } from "@/data/dummy/answers";
import { users } from '@/data/dummy/users';

import AnswerBox from "@/components/AnswerBox";
import { stringToColor } from '@/lib/helpers';
import FactBox from "@/components/FactBox";
import NotFound from '@/app/not-found';

import '../profile.scss';

interface AnswerInterface {
    id: string;
    post: string;
    author: string;
    content: string;
    date: Date;
    approved: boolean;
    votes: number;
}

export default function Profile({
    params
} : {
    params: { id: string }
}) {

    const userAddress = params.id;
    const user = users.filter(u => u.address === userAddress)[0];

    if (!user) return NotFound();

    return (
        <div id="profile">
            <div className="head">
                <div className="pfp-container">
                    <div
                        className="pfp"
                        style={{
                            background: `linear-gradient(45deg, ${stringToColor(userAddress)}, #2b0107)`
                        }}
                    ></div>
                </div>
                <div className="info">
                    <a
                        className="address"
                        href={"https://tronscan.org/#/address/" + userAddress}
                        target="_blank"
                    >
                        {userAddress}
                        <FaShareFromSquare />
                    </a>
                    <p className="balance">
                        {user.balance.toFixed(2)}
                        <FaAward />
                    </p>
                </div>
            </div>

            <div className="posts">
                <h2>Posts</h2>

                {!user.posts.length ? (
                    <p>There are no posts has been published by you.</p>
                ) : (
                    <div className="content">
                        {user.posts.map((post: string, i: number) => {
                            // Get post from its ID
                            const question = questions.filter(q => q.id === post)[0];

                            // In case if there's a deleted post
                            if (!question) return <></>

                            return (
                                <FactBox
                                    key={i}
                                    id={question.id}
                                    title={question.title}
                                    description={question.description}
                                    author={question.author}
                                    bounty={question.bounty}
                                    date={question.date}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="answers">
                <h2>Answers</h2>

                {!user.answers.length ? (
                    <p>There are no answers has been published by you.</p>
                ) : (
                    <div className="content">
                        {user.answers.map((answer: string | AnswerInterface, i: number) => {
                            // Get answer from its ID
                            answer = answers.filter(a => a.id === answer)[0];

                            if (!answer) return <></>

                            // Show summary of the answer
                            return (
                                <AnswerBox
                                    key={i}
                                    id={answer.id}
                                    post={answer.post}
                                    answer={answer.content}
                                    author={answer.author}
                                    votes={answer.votes}
                                    approved={answer.approved}
                                    date={answer.date}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}