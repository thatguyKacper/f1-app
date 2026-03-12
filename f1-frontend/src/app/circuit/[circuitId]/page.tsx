import { getCircuitDetails } from "@/lib/api";

export default async function CircuitPage({
  params,
}: {
  params: Promise<{ circuitId: string }>;
}) {
  const resolvedParams = await params;
  const circuit = await getCircuitDetails(resolvedParams.circuitId);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-4xl font-black text-slate-900 uppercase">
          {circuit.name}
        </h2>
        <p className="text-slate-500 font-medium mt-2 flex gap-4 text-sm">
          <span>
            📍 {circuit.locality}, {circuit.country}
          </span>
          <span>
            🏁 Races Held:{" "}
            <span className="font-bold text-slate-800">
              {circuit.racesHeldCount}
            </span>
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 flex flex-col justify-center">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
            Official Lap Record
          </h3>
          {circuit.lapRecord ? (
            <div>
              <span className="text-4xl font-black text-white block mb-1">
                ⏱️ {circuit.lapRecord.time}
              </span>
              <span className="text-red-500 font-bold text-lg">
                {circuit.lapRecord.driverName}
              </span>
              <span className="text-slate-500 ml-2">
                ({circuit.lapRecord.year})
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic">
              No lap record data available.
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
            Recent Grand Prix Here
          </h3>
          <ul className="space-y-3">
            {circuit.recentRaces.map((round) => (
              <li key={round.id} className="flex justify-between items-center">
                <span className="font-bold text-slate-700">{round.name}</span>
                <span className="px-3 py-1 bg-slate-100 text-red-600 rounded text-xs font-bold">
                  {round.year}
                </span>
              </li>
            ))}
            {circuit.recentRaces.length === 0 && (
              <p className="text-slate-500 italic">No recent races found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
