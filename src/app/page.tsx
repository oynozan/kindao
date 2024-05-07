import { BsGithub } from "react-icons/bs";
import Proposals from "@/components/Proposals";
import Stats from "@/components/Stats";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default function Home() {
    return (
        <div id="home">
            <nav>
                <h1>Welcome to the Universe of <span>Decentralized Fact-Check</span></h1>
                <p>Kindao is a &quot;decentralized fact-check&quot; application. You can earn KDAO tokens by fact-checking and contributing against online misinformation.</p>
            </nav>

            <div className="content">
                <Proposals />

                <div className="sidebar">
                    <Stats />

                    <div className="social">
                        <p><span>Kindao</span> is an open-source project.</p>
                        <a target="_blank" href="https://github.com/oynozan/kindao"><BsGithub /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}