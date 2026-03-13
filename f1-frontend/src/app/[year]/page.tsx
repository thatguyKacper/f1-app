import { getSeasonRaces } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeasonHeader } from "@/components/SeasonHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const resolvedParams = await params;
  const year = resolvedParams.year;

  if (!/^\d{4}$/.test(year)) {
    notFound();
  }

  const { races } = await getSeasonRaces(year);

  return (
    <div className="space-y-6">
      <SeasonHeader year={year} activeTab="calendar" />

      <div className="rounded-sm shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rnd</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Grand Prix</TableHead>
              <TableHead>Circuit</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead className="text-right">Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => {
              const date = new Date(race.raceDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              });

              return (
                <TableRow key={race.roundId} className="group">
                  <TableCell>{race.roundNumber}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell className="font-semibold hover:text-red-600">
                    <Link href={`/race/${race.roundId}`}>{race.raceName}</Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/circuit/${race.circuitId}`}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      {race.circuitName}
                    </Link>
                    , {race.country}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {race.winnerName ? (
                      <Link
                        href={`/driver/${race.driverId}`}
                        className="hover:text-red-600 cursor-pointer"
                      >
                        {race.winnerName}
                      </Link>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                      >
                        Upcoming
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {race.winnerName ? (
                      <Link
                        href={`/team/${race.teamId}`}
                        className="hover:text-red-600 cursor-pointer"
                      >
                        {race.teamName}
                      </Link>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                      >
                        Upcoming
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
