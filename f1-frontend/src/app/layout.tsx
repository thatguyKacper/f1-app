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
        <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
          <aside className="w-full md:w-64 bg-slate-900 text-white flex md:flex-col shadow-xl z-10 md:h-screen shrink-0 overflow-x-auto md:overflow-y-auto">
            <div className="p-4 md:p-6 bg-red-600 flex-shrink-0 flex items-center justify-center md:block">
              <Link href="/">
                <h1 className="text-xl md:text-2xl font-black italic tracking-wider text-white hover:scale-105 transition-transform cursor-pointer">
                  F1 STATS
                </h1>
              </Link>
            </div>

            <div className="flex md:flex-col md:p-4 flex-1 overflow-x-auto md:overflow-y-auto custom-scrollbar whitespace-nowrap md:whitespace-normal items-center md:items-start p-2 gap-2 md:gap-0">
              <h2 className="hidden md:block text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-2">
                Seasons
              </h2>
              <ul className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 w-full">
                {seasons.map((year) => (
                  <li key={year}>
                    <Link
                      href={`/${year}`}
                      className="block px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm md:text-base"
                    >
                      {year}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
