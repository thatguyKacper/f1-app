import { getStats } from "@/lib/api";
import { DriverStatCount, FastestPitStop, TeamStatCount } from "@/types/f1";

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          ⚡ Hall of Fame & <span className="text-red-600">Fun Stats</span>
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Historical records, mind-blowing facts, and extreme Formula 1
          statistics straight from the database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🏎️💨</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Fastest Pit Lane Time
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            The quickest recorded pit lane time in F1 history.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {stats.fastestPitStops?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-red-600 block">
                    {stats.fastestPitStops[0].duration}s
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {stats.fastestPitStops[0].teamName}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {stats.fastestPitStops[0].driverName} (
                    {stats.fastestPitStops[0].year})
                  </span>
                </div>

                <details className="text-sm text-slate-600 cursor-pointer group">
                  <summary className="font-semibold text-slate-500 hover:text-slate-800 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                    {stats.fastestPitStops
                      .slice(1)
                      .map((stat: FastestPitStop, idx: number) => (
                        <li key={idx} className="flex flex-col">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">
                              {idx + 2}. {stat.teamName}
                            </span>
                            <span className="font-bold text-red-600">
                              {stat.duration}s
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 leading-none">
                            {stat.driverName} ({stat.year})
                          </span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">💥</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Career DNF`&apos;s
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            The unluckiest driver with the most &quot;Did Not Finish&quot;
            results.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {stats.mostDnfs?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-slate-800 block">
                    {stats.mostDnfs[0].count}{" "}
                    <span className="text-lg text-slate-500">Races</span>
                  </span>
                  <span className="text-sm font-bold text-red-600 block">
                    {stats.mostDnfs[0].driverName}
                  </span>
                </div>

                <details className="text-sm text-slate-600 cursor-pointer group">
                  <summary className="font-semibold text-slate-500 hover:text-slate-800 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                    {stats.mostDnfs
                      .slice(1)
                      .map((stat: DriverStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-700">
                            {idx + 2}. {stat.driverName}
                          </span>
                          <span className="font-bold">{stat.count}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow hover:border-yellow-300">
          <div className="text-3xl mb-4">👑</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Championships
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            The undisputed kings of motorsport.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            {stats.mostChampionships?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-yellow-600 block">
                    {stats.mostChampionships[0].count}{" "}
                    <span className="text-lg text-yellow-700/50">Titles</span>
                  </span>
                  <span className="text-sm font-bold text-slate-800 block">
                    {stats.mostChampionships[0].driverName}
                  </span>
                </div>

                <details className="text-sm text-yellow-800 cursor-pointer group">
                  <summary className="font-semibold text-yellow-700 hover:text-yellow-900 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-yellow-200">
                    {stats.mostChampionships
                      .slice(1)
                      .map((stat: DriverStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-yellow-900">
                            {idx + 2}. {stat.driverName}
                          </span>
                          <span className="font-bold text-yellow-700">
                            {stat.count}
                          </span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🏆</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Race Wins
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Drivers with the highest number of Grand Prix victories.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {stats.mostRaceWins?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-slate-800 block">
                    {stats.mostRaceWins[0].count}{" "}
                    <span className="text-lg text-slate-500">Wins</span>
                  </span>
                  <span className="text-sm font-bold text-red-600 block">
                    {stats.mostRaceWins[0].driverName}
                  </span>
                </div>

                <details className="text-sm text-slate-600 cursor-pointer group">
                  <summary className="font-semibold text-slate-500 hover:text-slate-800 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                    {stats.mostRaceWins
                      .slice(1)
                      .map((stat: DriverStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-700">
                            {idx + 2}. {stat.driverName}
                          </span>
                          <span className="font-bold">{stat.count}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🛡️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Constructor Titles
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            The most successful engineering teams in history.
          </p>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
            {stats.mostTeamChampionships?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-white block">
                    {stats.mostTeamChampionships[0].count}{" "}
                    <span className="text-lg text-slate-400">Titles</span>
                  </span>
                  <span className="text-sm font-bold text-red-500 block">
                    {stats.mostTeamChampionships[0].teamName}
                  </span>
                </div>

                <details className="text-sm text-slate-400 cursor-pointer group">
                  <summary className="font-semibold text-slate-300 hover:text-white outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-700">
                    {stats.mostTeamChampionships
                      .slice(1)
                      .map((stat: TeamStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-300">
                            {idx + 2}. {stat.teamName}
                          </span>
                          <span className="font-bold text-white">
                            {stat.count}
                          </span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🚦</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Race Starts
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Drivers with the highest number of Grand Prix starts.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {stats.mostRaceStarts?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-slate-800 block">
                    {stats.mostRaceStarts[0].count}{" "}
                    <span className="text-lg text-slate-500">Races</span>
                  </span>
                  <span className="text-sm font-bold text-red-600 block">
                    {stats.mostRaceStarts[0].driverName}
                  </span>
                </div>

                <details className="text-sm text-slate-600 cursor-pointer group">
                  <summary className="font-semibold text-slate-500 hover:text-slate-800 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                    {stats.mostRaceStarts
                      .slice(1)
                      .map((stat: DriverStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-700">
                            {idx + 2}. {stat.driverName}
                          </span>
                          <span className="font-bold">{stat.count}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🔄</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 uppercase">
            Most Laps Completed
          </h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            The ultimate ironmen of F1 (proxy for total distance and time
            raced).
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            {stats.mostLapsCompleted?.length > 0 ? (
              <>
                <div className="mb-4">
                  <span className="font-black text-3xl text-slate-800 block">
                    {new Intl.NumberFormat("en-US").format(
                      stats.mostLapsCompleted[0].count,
                    )}{" "}
                    <span className="text-lg text-slate-500">Laps</span>
                  </span>
                  <span className="text-sm font-bold text-red-600 block">
                    {stats.mostLapsCompleted[0].driverName}
                  </span>
                </div>

                <details className="text-sm text-slate-600 cursor-pointer group">
                  <summary className="font-semibold text-slate-500 hover:text-slate-800 outline-none list-none flex items-center gap-1 select-none">
                    ▶ View Top 5
                  </summary>
                  <ul className="mt-3 space-y-2 pl-2 border-l-2 border-slate-200">
                    {stats.mostLapsCompleted
                      .slice(1)
                      .map((stat: DriverStatCount, idx: number) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-700">
                            {idx + 2}. {stat.driverName}
                          </span>
                          <span className="font-bold">
                            {new Intl.NumberFormat("en-US").format(stat.count)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </details>
              </>
            ) : (
              <span className="text-slate-400 italic">Data unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
