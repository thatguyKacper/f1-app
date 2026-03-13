import { getDriverStandings } from "@/lib/api";
import Link from "next/link";
import { SeasonHeader } from "@/components/SeasonHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <SeasonHeader year={year} activeTab="drivers" />

      <div className="rounded-sm shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>PTS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((driver, idx) => (
              <TableRow key={idx}>
                <TableCell>{driver.position}</TableCell>
                <TableCell className="font-semibold">
                  <Link
                    href={`/driver/${driver.driverId}`}
                    className="hover:text-red-600 transition-colors"
                  >
                    {driver.driverName}
                  </Link>
                </TableCell>
                <TableCell>{driver.nationality}</TableCell>
                <TableCell className="font-semibold">
                  <Link
                    href={`/team/${driver.teamId}`}
                    className="hover:text-red-600 transition-colors"
                  >
                    {driver.teamName}
                  </Link>
                </TableCell>
                <TableCell>{driver.wins}</TableCell>
                <TableCell className="font-semibold">{driver.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
