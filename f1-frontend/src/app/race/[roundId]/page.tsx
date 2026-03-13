import { getRoundDetails, getRaceResults } from "@/lib/api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div className="border-b pb-6 relative">
        <Link
          href={`/${new Date(roundDetails.date).getFullYear()}`}
          className="text-sm font-semibold text-muted-foreground hover:text-red-600 transition-colors mb-4 inline-block"
        >
          &larr; Back to Season
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏁</span>
          <h2 className="text-4xl font-black">{roundDetails.raceName}</h2>
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          {roundDetails.circuitName}, {roundDetails.country}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{raceDate}</p>
      </div>

      <div className="bg-background rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-[80px]">Pos</TableHead>
              <TableHead>No</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Laps</TableHead>
              <TableHead>Time/Retired</TableHead>
              <TableHead className="text-right">PTS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-black text-lg">
                    {result.position || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono font-bold">
                    {result.carNumber || "-"}
                  </TableCell>
                  <TableCell className="font-bold">
                    <Link
                      href={`/driver/${result.driverId}`}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {result.driverName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs font-bold uppercase tracking-wider">
                    <Link
                      href={`/team/${result.teamId}`}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {result.teamName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {result.laps}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {result.time || result.status || "-"}
                  </TableCell>
                  <TableCell className="text-right font-black text-lg">
                    {result.points}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  <span className="text-2xl block mb-2">⏱️</span>
                  No results available for this session yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
