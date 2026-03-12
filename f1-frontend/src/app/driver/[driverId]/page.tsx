import { getDriverDetails } from "@/lib/api";
import Link from "next/link";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const resolvedParams = await params;
  const driver = await getDriverDetails(resolvedParams.driverId);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase">
            {driver.forename}{" "}
            <span className="text-red-600">{driver.surname}</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {driver.nationality}
            {driver.carNumber && ` • Car #${driver.carNumber}`}
          </p>
        </div>
        {driver.wikipedia && (
          <a
            href={driver.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-200"
          >
            Wikipedia ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center shadow-sm">
          <span className="block text-3xl font-black text-yellow-600">
            {driver.championships}
          </span>
          <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider mt-1 block">
            World Titles
          </span>
        </div>

        <details className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm group relative">
          <summary className="p-4 text-center cursor-pointer list-none outline-none hover:bg-slate-100 rounded-xl transition-colors">
            <span className="block text-3xl font-black text-slate-800">
              {driver.raceWinsList.length}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              Race Wins{" "}
              <span className="text-[10px] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </span>
          </summary>
          <div className="border-t border-slate-200 max-h-60 overflow-y-auto bg-white rounded-b-xl custom-scrollbar">
            {driver.raceWinsList.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {driver.raceWinsList.map((win, idx) => (
                  <li
                    key={idx}
                    className="p-3 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-700 block">
                        {win.raceName}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {win.circuitName}
                      </span>
                    </div>
                    <span className="font-black text-red-600 bg-red-50 px-2 py-1 rounded shadow-sm">
                      {win.year}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-xs text-slate-400 text-center italic">
                No race wins recorded.
              </div>
            )}
          </div>
        </details>

        <details className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm group relative">
          <summary className="p-4 text-center cursor-pointer list-none outline-none hover:bg-slate-100 rounded-xl transition-colors">
            <span className="block text-3xl font-black text-slate-800">
              {driver.podiumsList.length}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
              Podiums{" "}
              <span className="text-[10px] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </span>
          </summary>
          <div className="border-t border-slate-200 max-h-60 overflow-y-auto bg-white rounded-b-xl custom-scrollbar">
            {driver.podiumsList.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {driver.podiumsList.map((podium, idx) => (
                  <li
                    key={idx}
                    className="p-3 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-700 block leading-tight">
                        {podium.raceName}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase leading-tight">
                        {podium.circuitName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black text-xs px-2 py-1 rounded ${podium.position === 1 ? "bg-yellow-100 text-yellow-700" : podium.position === 2 ? "bg-slate-200 text-slate-700" : "bg-orange-100 text-orange-700"}`}
                      >
                        P{podium.position}
                      </span>
                      <span className="font-bold text-slate-500 text-xs">
                        {podium.year}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-xs text-slate-400 text-center italic">
                No podiums recorded.
              </div>
            )}
          </div>
        </details>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm">
          <span className="block text-3xl font-black text-blue-700">
            {new Intl.NumberFormat("en-US").format(driver.careerPoints)}
          </span>
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mt-1 block">
            Career Points
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex justify-between items-center">
          <span>Season-by-Season Performance</span>
          <span className="text-sm font-normal text-slate-500">
            Points scored per constructor
          </span>
        </h3>

        <div className="space-y-3">
          {driver.seasonHistory.map((season, index) => (
            <Link
              key={`${season.year}-${season.teamId}`}
              href={`/team/${season.teamId}`}
              className=" flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-slate-800 text-lg w-12 text-center">
                  {season.year}
                </span>
                <span className="font-semibold text-slate-600 group-hover:text-red-600">
                  {season.teamName}
                </span>
              </div>

              <div className="text-right">
                <span className="block font-black text-slate-800 text-lg leading-none">
                  {new Intl.NumberFormat("en-US").format(season.points)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  PTS
                </span>
              </div>
            </Link>
          ))}

          {driver.seasonHistory.length === 0 && (
            <p className="text-slate-500 italic">
              No seasonal performance data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
