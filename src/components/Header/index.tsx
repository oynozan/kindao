import Link from "next/link";
import { IoMenu } from "react-icons/io5";

import Brand from "../Brand";
import WalletButton from "./WalletButton";

import './header.scss';

export default function Header() {
    return (
        <header>
            <Link href="/">
                <Brand />
            </Link>

            <div className="links">
                <Link href="/">Facts</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                <Link href="/withdraw">Withdraw</Link>
                <Link href="/token">KINDAO Token</Link>
            </div>

            <div className="actions">
                <WalletButton />
            </div>

            <div className="mobile">
                <IoMenu color="#fff" size={30} />
            </div>
        </header>
    )
}