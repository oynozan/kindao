import './token.scss';

export default function Token() {
    return (
        <div id="token">
            <h1>About KDAO Token</h1>
            <h2>Abstract</h2>
            <p>KDAO is a utility token that is distributed between fact-checkers. KDAO token is given to users as a reward, for the mission to combat misinformation. This whitepaper outlines the key features, mechanisms, and benefits of KDAO.</p>

            <h2>Utility</h2>
            <p>KDAO serves as the primary incentive mechanism for fact-checkers within the Kindao ecosystem. Fact-checkers earn KDAO tokens for successfully debunking misinformation or providing accurate information. These tokens can be used within the Kindao platform for various purposes, including:</p>
            <ol>
                <li>Attaching bounties to fact publishings to reward honest fact-checkers.</li>
                <li>Trading on supported cryptocurrency exchanges for liquidity and value realization.</li>
            </ol>

            <h2>Distribution</h2>
            <p>KDAO tokens are distributed to fact-checkers based on their contributions and reputation within the Kindao community. The distribution mechanism is designed to reward accuracy, diligence, and active participation in the fact-checking process.</p>
            <ul>
                <li>The three individuals with the most upvotes on their fact reviews will earn KDAO tokens.</li>
                <li>The tokens attached as bounty to each fact review will be distributed to the fact-checkers according to the number of upvotes they receive.</li>
            </ul>

            <h2>Governance</h2>
            <p>The governance of KDAO tokens is decentralized, allowing community members to participate in decision-making processes. Token holders have the power to propose fact reviews in the Kindao platform. This democratic governance model ensures the alignment on community engagement and ownership.</p>
        </div>
    )
}