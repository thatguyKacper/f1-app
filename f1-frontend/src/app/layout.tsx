import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSeasons } from "../lib/api";
import TopNav from "../components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Stats Dashboard",
  description: "Historical Formula 1 results and standings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seasons = await getSeasons();

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        <TopNav seasons={seasons} />

        <main className="flex-1 w-full p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
