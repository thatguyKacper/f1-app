import { getSeasonRaces } from "@/lib/api";
import Link from "next/link";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const resolvedParams = await params;
  const year = resolvedParams.year;

  const { races } = await getSeasonRaces(year);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-slate-900">
          {year} <span className="text-red-600 font-light">Season</span>
        </h2>

        <div className="flex gap-2 mt-6">
          <Link
            href={`/${year}`}
            className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-md shadow-sm"
          >
            Calendar
          </Link>
          <Link
            href={`/${year}/drivers`}
            className="px-5 py-2 text-sm font-bold bg-white text-slate-600 border border-gray-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Driver Standings
          </Link>
          <Link
            href={`/${year}/teams`}
            className="px-5 py-2 text-sm font-bold bg-white text-slate-600 border border-gray-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Team Standings
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Rnd</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Grand Prix</th>
                <th className="px-6 py-4">Circuit</th>
                <th className="px-6 py-4">Winner</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {races.map((race) => {
                const date = new Date(race.raceDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                  },
                );

                return (
                  <tr
                    key={race.roundId}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-slate-400">
                      {race.roundNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {date}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      {/* Flaga w formie emoji jako mały bajer */}
                      <span className="text-lg">🏁</span>
                      {race.raceName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {race.circuitName}, {race.country}
                    </td>
                    <td className="px-6 py-4">
                      {race.winnerName ? (
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {race.winnerName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {race.teamName}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/race/${race.roundId}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        Results &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
