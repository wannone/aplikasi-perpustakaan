"use client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentHistoryModel } from "../../../api/model/book";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { getAuth } from "../../../api/fetch/getAuth";
import { userRentHistory } from "../../../api/fetch/userRentHistory";
import { cn } from "@/lib/utils";

export function BookTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = useState<RentHistoryModel[]>([]);
  const { toast } = useToast();
  const token = getCookie("token");
  const columns: ColumnDef<RentHistoryModel>[] = [
    {
      accessorKey: "peminjaman_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("peminjaman_id")}</div>,
    },
    {
      accessorKey: "buku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Book
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("buku")}</div>
      ),
    },
    {
      accessorKey: "petugas",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
            Librarian
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("petugas")}</div>
      ),
    },
    {
      accessorKey: "waktu_peminjaman",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
            Rent Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("waktu_peminjaman")}</div>
      ),
    },
    {
      accessorKey: "durasi_peminjaman_in_days",
      header: "Duration",
      cell: ({ row }) => <div>{row.getValue("durasi_peminjaman_in_days")}</div>,
    },
    {
        accessorKey: "waktu_pengembalian",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-left"
          >
            Return Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("waktu_pengembalian") ?? "loan"}</div>
        ),
      },
      {
        accessorKey: "total_keterlambatan_in_days",
        header: "Late",
        cell: ({ row }) => <div>{row.getValue("waktu_pengembalian") ? row.getValue("total_keterlambatan_in_days") : "-"}</div>,
      },
      {
        accessorKey: "total_denda",
        header: "Fine",
        cell: ({ row }) => <div>{row.getValue("waktu_pengembalian") ? row.getValue("total_denda") : "-"}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("waktu_pengembalian") ? "Returned" : "On Loan";
            return <Label className={cn(status == "Returned" ? "text-green-500" : "text-amber-500")}>{status}</Label>;
        },
      }
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const fetchRentHistory = async () => {
    try {
      if (token) {
        const auth = await getAuth(token);
        if (auth){
            const userRent = await userRentHistory(auth.user_id);
            setData(userRent);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRentHistory();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by buku"
          value={(table.getColumn("buku")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.setColumnFilters([
              {
                id: "buku",
                value: event.target.value,
              },
            ])
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table className="min-w-full bg-white border border-gray-300 shadow-md">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-sm font-medium text-gray-700 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted border-t border-gray-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 text-sm text-gray-600 text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
