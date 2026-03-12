import { getRoundDetails, getRaceResults } from "@/lib/api";
import Link from "next/link";

export default async function RacePage({
  params,
}: {
  params: Promise<{ roundId: string }>;
}) {
  const resolvedParams = await params;
  const roundId = resolvedParams.roundId;

  const [roundDetails, { results }] = await Promise.all([
    getRoundDetails(roundId),
    getRaceResults(roundId),
  ]);

  const raceDate = new Date(roundDetails.date).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6 relative">
        <Link
          href={`/${new Date(roundDetails.date).getFullYear()}`}
          className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors mb-4 inline-block"
        >
          &larr; Back to Season
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏁</span>
          <h2 className="text-4xl font-black text-slate-900">
            {roundDetails.raceName}
          </h2>
        </div>
        <p className="text-lg text-slate-600 font-medium">
          {roundDetails.circuitName}, {roundDetails.country}
        </p>
        <p className="text-sm text-slate-500 mt-1">{raceDate}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900 text-slate-300 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Pos</th>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Laps</th>
                <th className="px-6 py-4">Time/Retired</th>
                <th className="px-6 py-4 text-right">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-black text-slate-900">
                      {result.position || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono font-bold">
                      {result.carNumber || "-"}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <Link
                        href={`/driver/${result.driverId}`}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {result.driverName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <Link
                        href={`/team/${result.teamId}`}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        {result.teamName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{result.laps}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {result.time || result.status || "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">
                      {result.points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <span className="text-2xl block mb-2">⏱️</span>
                    No results available for this session yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
