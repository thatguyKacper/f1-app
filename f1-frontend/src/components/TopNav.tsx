"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav({ seasons }: { seasons: number[] }) {
  const pathname = usePathname();

  const yearMatch = pathname.match(/^\/(\d{4})/);

  const currentYear = yearMatch ? yearMatch[1] : seasons[0] || 2026;

  return (
    <header className="bg-slate-900 border-b-4 border-red-600 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center bg-red-600 h-full px-4 -ml-4 sm:-ml-6 lg:-ml-8">
            <Link href="/">
              <h1 className="text-2xl font-black italic tracking-wider text-white hover:scale-105 transition-transform cursor-pointer">
                F1 STATS
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href={`/${currentYear}`}
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${pathname === `/${currentYear}` ? "text-white border-b-2 border-red-500" : "text-slate-300 hover:text-white"}`}
            >
              Schedule
            </Link>
            <Link
              href={`/${currentYear}/drivers`}
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${pathname.includes("/drivers") ? "text-white border-b-2 border-red-500" : "text-slate-300 hover:text-white"}`}
            >
              Drivers
            </Link>
            <Link
              href={`/${currentYear}/teams`}
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${pathname.includes("/teams") ? "text-white border-b-2 border-red-500" : "text-slate-300 hover:text-white"}`}
            >
              Teams
            </Link>
            <Link
              href="/stats"
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${pathname.includes("/stats") ? "text-white border-b-2 border-red-500" : "text-slate-300 hover:text-white"}`}
            >
              Stats
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button className="text-slate-300 hover:text-white focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-800 border-b border-slate-700 overflow-x-auto custom-scrollbar">
        <div className="px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-6 py-4">
            <li className="text-xs font-bold text-slate-400 uppercase tracking-widest self-center mr-2">
              Seasons
            </li>
            {seasons.map((year) => {
              const isActive = year.toString() === currentYear.toString();
              return (
                <li key={year} className="shrink-0">
                  <Link
                    href={`/${year}`}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {year}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
