import { BsGithub } from "react-icons/bs";
import FactBox from "@/components/FactBox";
import { questions } from "@/data/dummy/questions";
import { stats } from "@/data/dummy/stats";

export default function Home() {
    return (
        <div id="home">
            <nav>
                <h1>Welcome to the Universe of <span>Decentralized Fact-Check</span></h1>
                <p>Kindao is a &quot;decentralized fact-check&quot; application. You can earn KINDAO tokens by fact-checking and contributing against online misinformation.</p>
            </nav>

            <div className="content">
                <div className="facts">
                    {questions.map((question, i) => {
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
                <div className="sidebar">
                    <div className="stats">
                        <h4>Total Posts</h4>
                        <p>{stats.totalFactRequests}</p>
                        <h4>Total Fact Reviews</h4>
                        <p>{stats.totalFactReviews}</p>
                        <h4>Earned KINDAO Tokens</h4>
                        <p>{stats.totalEarnedTokens}</p>
                        <h4>Total Fact-Checkers</h4>
                        <p>{stats.totalFactCheckers}</p>
                    </div>

                    <div className="social">
                        <p><span>Kindao</span> is an open-source project.</p>
                        <a target="_blank" href="https://github.com/oynozan/kindao"><BsGithub /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}