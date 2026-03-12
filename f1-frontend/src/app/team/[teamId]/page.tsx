import { getTeamDetails } from "@/lib/api";
import Link from "next/link";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const resolvedParams = await params;
  const team = await getTeamDetails(resolvedParams.teamId);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase">
            {team.name}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {team.nationality
              ? `🌍 ${team.nationality}`
              : "Nationality unknown"}
          </p>
        </div>

        {team.wikipedia && (
          <a
            href={team.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-200 transition-colors"
          >
            Wikipedia ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200  p-6 rounded-xl text-center shadow-sm">
          <span className="block text-4xl font-black text-yellow-600">
            {team.championships}
          </span>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1 block">
            Constructors Titles
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center shadow-sm">
          <span className="block text-4xl font-black text-slate-800">
            {team.raceWins}
          </span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1 block">
            Race Victories
          </span>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center shadow-sm">
          <span className="block text-4xl font-black text-blue-700">
            {new Intl.NumberFormat("en-US").format(team.totalPoints)}
          </span>
          <span className="text-sm font-bold text-blue-800 uppercase tracking-wider mt-1 block">
            Total Points
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex justify-between items-center">
          <span>Hall of Fame: Driver Points</span>
          <span className="text-sm font-normal text-slate-500">
            Sorted by total points scored for the team
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.driversHistory.map((td, index) => (
            <Link
              href={`/driver/${td.driverId}`}
              key={td.driverId}
              className="flex items-center p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors group relative overflow-hidden"
            >
              {index < 3 && (
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-slate-300" : "bg-orange-400"}`}
                ></div>
              )}

              <div className="flex-1 pl-2">
                <span className="font-semibold text-slate-700 block group-hover:text-red-600 transition-colors">
                  {td.driverName}
                </span>
                <span className="text-slate-400 font-bold text-xs">
                  {td.years}
                </span>
              </div>

              <div className="text-right">
                <span className="block font-black text-slate-800 text-lg leading-none">
                  {new Intl.NumberFormat("en-US").format(td.points)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  PTS
                </span>
              </div>
            </Link>
          ))}

          {team.driversHistory.length === 0 && (
            <p className="text-slate-500 italic col-span-full">
              No driver history available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
