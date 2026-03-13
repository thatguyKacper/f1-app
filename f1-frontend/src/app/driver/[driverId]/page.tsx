import { getDriverDetails } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";

export default async function DriverPage({
  params,
  searchParams,
}: {
  params: Promise<{ driverId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const driverId = resolvedParams.driverId;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const sort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : undefined;
  const order =
    typeof resolvedSearchParams.order === "string"
      ? resolvedSearchParams.order
      : undefined;

  const driver = await getDriverDetails(driverId, currentPage, sort, order);

  const allResults = driver.allResults || {
    results: [],
    page: 1,
    totalPages: 1,
    total: 0,
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase">
            {driver.forename}{" "}
            <span className="text-red-600">{driver.surname}</span>
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            {driver.nationality}
            {driver.carNumber && ` • Car #${driver.carNumber}`}
          </p>
        </div>
        {driver.wikipedia && (
          <a
            href={driver.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-semibold hover:bg-secondary/80 transition-colors"
          >
            Wikipedia ↗
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-yellow-50/50 border-yellow-200 shadow-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
              World Titles
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black text-yellow-600">
              {driver.championships}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Race Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black">
              {driver.raceWinsList?.length || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Podiums
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black">
              {driver.podiumsList?.length || 0}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-200 shadow-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Career Points
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-4xl font-black text-blue-700">
              {new Intl.NumberFormat("en-US").format(driver.careerPoints || 0)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end border-b pb-2">
          <h3 className="text-2xl font-black">Complete Race History</h3>
          <span className="text-sm text-muted-foreground">
            All recorded sessions
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
