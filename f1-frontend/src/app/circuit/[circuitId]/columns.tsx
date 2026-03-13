"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "year",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-slate-100"
      >
        Year <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-black text-slate-400">{row.original.year}</span>
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
    accessorKey: "driverName",
    header: "Winner",
    cell: ({ row }) =>
      row.original.driverId ? (
        <div>
          <Link
            href={`/driver/${row.original.driverId}`}
            className="hover:text-red-600 font-bold block"
          >
            {row.original.driverName}
          </Link>
          <Link
            href={`/team/${row.original.teamId}`}
            className="text-muted-foreground text-[10px] uppercase font-bold hover:text-red-600"
          >
            {row.original.teamName}
          </Link>
        </div>
      ) : (
        <span className="text-muted-foreground italic">No Winner</span>
      ),
  },
  {
    accessorKey: "time",
    header: () => <div className="text-right">Time</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-muted-foreground">
        {row.original.time || "-"}
      </div>
    ),
  },
];
