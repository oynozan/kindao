
import AnswerBox from "@/components/AnswerBox";
import FactBox from "@/components/FactBox";
import NotFound from '@/app/not-found';

import '../profile.scss';
import ProfilePosts from "@/components/Profile/Posts";
import ProfileInfo from "@/components/Profile/Info";
import ProfileFacts from "@/components/Profile/Facts";

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
    if (!userAddress) return NotFound();

    return (
        <div id="profile">
            <ProfileInfo address={userAddress} />

            <div className="posts">
                <h2>Posts</h2>
                <ProfilePosts address={userAddress} />
            </div>

            <div className="answers">
                <h2>Answers</h2>
                <ProfileFacts address={userAddress} />
            </div>
        </div>
    )
}