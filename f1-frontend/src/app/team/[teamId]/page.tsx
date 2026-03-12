import { getTeamDetails } from "@/lib/api";
import Link from "next/link";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const resolvedParams = await params;
  const team = await getTeamDetails(resolvedParams.teamId);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase">
            {team.name}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
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
            className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded font-semibold hover:bg-slate-200 transition-colors"
          >
            Wikipedia ↗
          </a>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
          Driver History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.formula_one_teamdriver?.map((td: any) => (
            <div
              key={td.id}
              className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
            >
              <div>
                <Link href={`/driver/${td.formula_one_driver.id}`}>
                  <span className="font-bold text-slate-800 block hover:text-red-700 transition-colors">
                    {td.formula_one_driver.forename}{" "}
                    {td.formula_one_driver.surname}
                  </span>
                </Link>
                <span className="text-xs text-slate-500">
                  {td.formula_one_driver.nationality}
                </span>
              </div>
              <Link href={`/${td.formula_one_season.year}`}>
                <span className="font-bold text-slate-800 block hover:text-red-700 transition-colors">
                  {td.formula_one_season.year}
                </span>
              </Link>
            </div>
          ))}

          {(!team.formula_one_teamdriver ||
            team.formula_one_teamdriver.length === 0) && (
            <p className="text-slate-500 italic col-span-full">
              No driver history available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
