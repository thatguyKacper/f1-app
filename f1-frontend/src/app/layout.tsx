import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSeasons } from "../lib/api";

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
            <div className="p-6 bg-red-600">
              <Link href="/">
                <h1 className="text-2xl font-black italic tracking-wider text-white hover:scale-105 transition-transform cursor-pointer">
                  F1 STATS
                </h1>
              </Link>
            </div>

            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-2">
                Seasons
              </h2>
              <ul className="space-y-1">
                {seasons.map((year) => (
                  <li key={year}>
                    <Link
                      href={`/${year}`}
                      className="block px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                    >
                      {year} Season
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
