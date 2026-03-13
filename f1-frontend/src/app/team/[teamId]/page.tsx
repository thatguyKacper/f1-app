import { getTeamDetails } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/app/driver/[driverId]/data-table";

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamId: string }>;
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

  const team = await getTeamDetails(
    resolvedParams.teamId,
    currentPage,
    sort,
    order,
  );
  const allResults = team.allResults || {
    results: [],
    page: 1,
    totalPages: 1,
    total: 0,
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase">{team.name}</h2>
          <p className="text-muted-foreground font-medium mt-1">
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
            className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-semibold hover:bg-secondary/80 transition-colors"
          >
            Wikipedia ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50/50 border-yellow-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
              Constructors Titles
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black text-yellow-600">
              {team.championships}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Race Victories
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black">{team.raceWins}</span>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black text-blue-700">
              {new Intl.NumberFormat("en-US").format(team.totalPoints)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold border-b pb-2">
          Hall of Fame: Driver Points
        </h3>
        <div className="bg-background rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Years Active</TableHead>
                <TableHead className="text-right">PTS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.driversHistory.length > 0 ? (
                team.driversHistory.map((td, index) => (
                  <TableRow key={td.driverId}>
                    <TableCell className="font-bold text-muted-foreground">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-semibold">
                      <Link
                        href={`/driver/${td.driverId}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {td.driverName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {td.years}
                    </TableCell>
                    <TableCell className="text-right font-black text-lg">
                      {new Intl.NumberFormat("en-US").format(td.points)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground italic py-4"
                  >
                    No driver history available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end border-b pb-2">
          <h3 className="text-2xl font-black">All Team Entries</h3>
          <span className="text-sm text-muted-foreground">
            Every recorded race
          </span>
        </div>
        <DataTable
          data={allResults.results}
          pageCount={allResults.totalPages}
          currentPage={allResults.page}
          totalItems={allResults.total}
          currentSort={sort}
          currentOrder={order}
        />
      </div>
    </div>
  );
}
