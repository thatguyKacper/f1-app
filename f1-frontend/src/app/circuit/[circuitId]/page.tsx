import { getCircuitDetails } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";

export default async function CircuitPage({
  params,
  searchParams,
}: {
  params: Promise<{ circuitId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const sort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : undefined;
  const order =
    typeof resolvedSearchParams.order === "string"
      ? resolvedSearchParams.order
      : undefined;

  const circuit = await getCircuitDetails(
    resolvedParams.circuitId,
    currentPage,
    sort,
    order,
  );
  const allRaces = circuit.allRaces || {
    results: [],
    page: 1,
    totalPages: 1,
    total: 0,
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-4xl font-black uppercase">{circuit.name}</h2>
        <p className="text-muted-foreground font-medium mt-2 flex gap-4 text-sm">
          <span>
            📍 {circuit.locality}, {circuit.country}
          </span>
          <span>
            🏁 Races Held:{" "}
            <span className="font-bold text-foreground">
              {circuit.racesHeldCount}
            </span>
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="bg-slate-900 text-slate-100 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              Official Lap Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            {circuit.lapRecord ? (
              <div>
                <span className="text-4xl font-black text-white block mb-1">
                  ⏱️ {circuit.lapRecord.time}
                </span>
                <span className="text-red-500 font-bold text-lg">
                  {circuit.lapRecord.driverName}
                </span>
                <span className="text-slate-400 ml-2">
                  ({circuit.lapRecord.year})
                </span>
              </div>
            ) : (
              <span className="text-slate-500 italic">
                No lap record data available.
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4 mt-6">
        <div className="flex justify-between items-end border-b pb-2">
          <h3 className="text-2xl font-black">History of Winners</h3>
          <span className="text-sm text-muted-foreground">
            Every GP held at this circuit
          </span>
        </div>
        <DataTable
          data={allRaces.results}
          pageCount={allRaces.totalPages}
          currentPage={allRaces.page}
          totalItems={allRaces.total}
          currentSort={sort}
          currentOrder={order}
        />
      </div>
    </div>
  );
}
