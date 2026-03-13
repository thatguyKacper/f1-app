"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { RaceResultDetail } from "@/types/f1";

function getPositionBadge(position: number | null, status: string | null) {
  if (position === 1)
    return <Badge className="bg-yellow-500  text-white font-bold">P1</Badge>;
  if (position === 2)
    return (
      <Badge
        variant="secondary"
        className="bg-slate-300 text-slate-900 font-bold"
      >
        P2
      </Badge>
    );
  if (position === 3)
    return (
      <Badge variant="secondary" className="bg-orange-400 text-white font-bold">
        P3
      </Badge>
    );
  if (position && position >= 4 && position <= 10)
    return (
      <Badge variant="outline" className="font-semibold">
        P{position}
      </Badge>
    );
  if (position && position > 10)
    return (
      <Badge variant="outline" className="text-muted-foreground font-medium">
        P{position}
      </Badge>
    );
  return (
    <Badge variant="destructive" className="font-bold">
      {status || "DNF"}
    </Badge>
  );
}

export const columns: ColumnDef<RaceResultDetail>[] = [
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => (
      <span className=" text-muted-foreground">{row.original.year}</span>
    ),
  },
  {
    accessorKey: "raceName",
    header: "Grand Prix",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.raceName}</span>
    ),
  },
  {
    accessorKey: "circuitName",
    header: "Circuit",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.circuitName}
      </span>
    ),
  },
  {
    accessorKey: "teamName",
    header: "Team",
    cell: ({ row }) => (
      <Link
        href={`/team/${row.original.teamId}`}
        className="hover:text-red-600 font-semibold transition-colors"
      >
        {row.original.teamName}
      </Link>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-slate-100"
          >
            Result
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right pr-4">
          {getPositionBadge(row.original.position, row.original.status)}
        </div>
      );
    },
  },
];
