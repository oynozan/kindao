import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from 'react-hot-toast';

import Modals from "@/components/Modal/Modals";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import '../styles/main.scss';

const inter = Inter({ variable: "--inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--poppins", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kindao - Decentralized Fact-Check",
    description: "Fact-Check DAO application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`
				${inter.variable}
				${poppins.variable}
			`}>
                <Toaster position="top-center" />
                <Modals />
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
