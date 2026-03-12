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
        <h2 className="text-4xl font-black text-slate-900">{circuit.name}</h2>
        <p className="text-slate-500 font-medium mt-2 flex gap-4 text-sm">
          <span>
            📍 {circuit.locality}, {circuit.country}
          </span>
          {circuit.altitude !== null && (
            <span>⛰️ Alt: {circuit.altitude}m</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
            Recent Grand Prix Here
          </h3>
          <ul className="space-y-3">
            {circuit.formula_one_round.map((round: any) => (
              <li key={round.id} className="flex justify-between items-center">
                <span className="font-bold text-slate-700">{round.name}</span>
                <span className="px-3 py-1 bg-slate-100 text-red-600 rounded text-xs font-bold">
                  {round.formula_one_season.year}
                </span>
              </li>
            ))}
            {circuit.formula_one_round.length === 0 && (
              <p className="text-slate-500 italic">No recent races found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
