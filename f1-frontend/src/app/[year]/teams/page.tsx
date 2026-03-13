import { getTeamStandings } from "@/lib/api";
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

export default async function TeamStandingsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const resolvedParams = await params;
  const year = resolvedParams.year;

  const { standings } = await getTeamStandings(year);

  return (
    <div className="space-y-6">
      <SeasonHeader year={year} activeTab="teams" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead className="text-center">Drivers</TableHead>
            <TableHead className="text-center">Wins</TableHead>
            <TableHead className="text-right">PTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team, idx) => (
            <TableRow key={idx}>
              <TableCell>{team.position}</TableCell>
              <TableCell className="font-semibold">
                <Link
                  href={`/team/${team.teamId}`}
                  className="hover:text-red-600 transition-colors"
                >
                  {team.teamName}
                </Link>
              </TableCell>
              <TableCell>{team.nationality}</TableCell>
              <TableCell className="text-center">
                {team.drivers.split(",").map((driverStr) => {
                  const [id, name] = driverStr.split("|");

                  return (
                    <Link
                      key={id}
                      href={`/driver/${id}`}
                      className="font-semibold hover:text-red-600 transition-colors mr-4"
                    >
                      {name}
                    </Link>
                  );
                })}
              </TableCell>
              <TableCell className="text-center">{team.wins}</TableCell>
              <TableCell className="text-right">{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
