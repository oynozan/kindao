import Link from "next/link";
import { IoMenu } from "react-icons/io5";

import Brand from "../Brand";
import WalletButton from "./WalletButton";
import DropdownButton from "../Dropdown/DropdownButton";

import './header.scss';

export default function Header() {
    return (
        <header>
            <Link href="/">
                <Brand />
            </Link>

            <div className="links">
                <Link href="/">Facts</Link>
                <Link href="/post">Publish</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                <Link href="/withdraw">Withdraw</Link>
                <Link href="/token">KDAO Token</Link>
            </div>

            <div className="actions">
                <WalletButton />
            </div>

            <div className="mobile">
                <DropdownButton
                    type="blank"
                    items={[
                        <Link key={1} href="/">Facts</Link>,
                        <Link key={2} href="/post">Publish</Link>,
                        <Link key={3} href="/leaderboard">Leaderboard</Link>,
                        <Link key={4} href="/withdraw">Withdraw</Link>,
                        <Link key={5} href="/token">KDAO Token</Link>,
                    ]}
                >
                    <IoMenu color="#fff" size={30} />
                </DropdownButton>
            </div>
        </header>
    )
}