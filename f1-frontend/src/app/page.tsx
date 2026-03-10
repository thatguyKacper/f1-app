import { ApiResponse, PodiumDriver } from "@/types/f1";

async function getLatestPodium(): Promise<PodiumDriver[]> {
  // Using cache: 'no-store' for development to always see fresh data.
  // In production, you might use 'force-cache' or next: { revalidate: 60 }
  const res = await fetch(`${process.env.BASE_URL}/latest-podium`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch F1 data");
  }

  const json: ApiResponse<PodiumDriver[]> = await res.json();
  return json.data;
}

export default async function Home() {
  const podiumData = await getLatestPodium();

  // Extract race info from the first row (since all rows share the same race)
  const raceName = podiumData[0]?.raceName || "LATEST GRAND PRIX";

  return (
    <main className="min-h-screen bg-white text-f1-dark font-sans">
      {/* Mock Header similar to F1 website */}
      <header className="bg-f1-red text-white py-4 px-8 border-b-8 border-f1-dark">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black italic tracking-tighter">
            F1 API
          </h1>
          <nav className="hidden md:flex space-x-6 font-bold text-sm tracking-wider uppercase">
            <a href="#" className="hover:text-gray-300">
              Latest
            </a>
            <a href="#" className="border-b-2 border-white pb-1">
              Results
            </a>
            <a href="#" className="hover:text-gray-300">
              Standings
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation (Years) */}
        <aside className="w-full md:w-48 flex-shrink-0">
          <ul className="space-y-2 border-r-2 border-f1-gray pr-4 text-right font-bold text-lg text-gray-400">
            <li className="text-f1-dark cursor-pointer hover:text-f1-red transition-colors">
              2024
            </li>
            <li className="cursor-pointer hover:text-f1-dark transition-colors">
              2023
            </li>
            <li className="cursor-pointer hover:text-f1-dark transition-colors">
              2022
            </li>
            <li className="cursor-pointer hover:text-f1-dark transition-colors">
              2021
            </li>
          </ul>
        </aside>

        {/* Table Area */}
        <section className="flex-grow">
          <h2 className="text-4xl font-extrabold uppercase tracking-tight border-b-4 border-f1-red pb-4 mb-8">
            {raceName} - RACE RESULT
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-widest border-b-2 border-f1-dark">
                  <th className="py-4 px-4 font-bold">Pos</th>
                  <th className="py-4 px-4 font-bold">Driver</th>
                  <th className="py-4 px-4 font-bold">Car</th>
                  <th className="py-4 px-4 font-bold text-right">
                    Time/Retired
                  </th>
                  <th className="py-4 px-4 font-bold text-center">
                    Fastest Lap
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {podiumData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-lg">
                      {row.position}
                    </td>
                    <td className="py-4 px-4">
                      {/* Split forename and surname for styling */}
                      <span className="text-gray-500 mr-1">
                        {row.driverName.split(" ")[0]}
                      </span>
                      <span className="font-bold uppercase text-f1-dark">
                        {row.driverName.split(" ").slice(1).join(" ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 uppercase">
                      {row.teamName}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {row.totalTime}
                    </td>
                    <td className="py-4 px-4 text-center text-xl">
                      {row.isFastestLap ? (
                        <span className="text-purple-600">⏱️</span>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
