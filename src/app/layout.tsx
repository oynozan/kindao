import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Inter, Poppins } from "next/font/google";

const InitializeTron = dynamic(() => import('@/components/InitializeTron'), {
    ssr: false
});

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
                <InitializeTron />
                <Modals />
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
