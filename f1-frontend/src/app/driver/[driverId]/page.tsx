import { getDriverDetails } from "@/lib/api";
import Link from "next/link";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const resolvedParams = await params;
  const driver = await getDriverDetails(resolvedParams.driverId);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase">
            {driver.forename}{" "}
            <span className="text-red-600">{driver.surname}</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {driver.nationality}
            {driver.permanent_car_number &&
              ` • Car #${driver.permanent_car_number}`}
          </p>
        </div>
        {driver.wikipedia && (
          <a
            href={driver.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-200"
          >
            Wikipedia
          </a>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
          Career History (Teams)
        </h3>
        <ul className="space-y-2">
          {driver.formula_one_teamdriver.map((td: any) => (
            <li
              key={td.id}
              className="flex justify-between p-3 bg-slate-50 rounded-lg"
            >
              <Link
                href={`/team/${td.formula_one_team.id}`}
                className="text-slate-700 font-semibold hover:text-red-600 transition-colors cursor-pointer"
              >
                {td.formula_one_team.name}
              </Link>
              <Link
                href={`/${td.formula_one_season.year}`}
                className="text-slate-500 font-bold hover:text-red-600 transition-colors cursor-pointer"
              >
                {td.formula_one_season.year} Season
              </Link>
            </li>
          ))}
          {driver.formula_one_teamdriver.length === 0 && (
            <p className="text-slate-500 italic">No team data available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
