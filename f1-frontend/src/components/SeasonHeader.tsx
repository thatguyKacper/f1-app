"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeasonHeaderProps {
  year: string;
  activeTab: "calendar" | "drivers" | "teams";
}

export function SeasonHeader({ year, activeTab }: SeasonHeaderProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "calendar") router.push(`/${year}`);
    if (value === "drivers") router.push(`/${year}/drivers`);
    if (value === "teams") router.push(`/${year}/teams`);
  };

  return (
    <div className="pb-4 mb-6">
      <h2 className="text-3xl font-black text-slate-900">
        {year} <span className="text-red-600 font-light">Season</span>
      </h2>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
          <TabsTrigger value="teams">Team Standings</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
