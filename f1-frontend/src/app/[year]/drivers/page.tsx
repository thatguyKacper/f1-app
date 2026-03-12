import { getDriverStandings } from "@/lib/api";
import Link from "next/link";

export default async function DriverStandingsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const resolvedParams = await params;
  const year = resolvedParams.year;

  const { standings } = await getDriverStandings(year);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-slate-900">
          {year} <span className="text-red-600 font-light">Season</span>
        </h2>

        <div className="flex gap-2 mt-6">
          <Link
            href={`/${year}`}
            className="px-5 py-2 text-sm font-bold bg-white text-slate-600 border border-gray-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Calendar
          </Link>
          <Link
            href={`/${year}/drivers`}
            className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-md shadow-sm"
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
                <th className="px-6 py-4">Pos</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Nationality</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4 text-center">Wins</th>
                <th className="px-6 py-4 text-right">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {standings.map((driver, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-900 text-lg">
                    {driver.position}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <Link
                      href={`/driver/${driver.driverId}`}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {driver.driverName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {driver.nationality}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <Link
                      href={`/team/${driver.teamId}`}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {driver.teamName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-600">
                    {driver.wins}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 text-lg">
                    {driver.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
