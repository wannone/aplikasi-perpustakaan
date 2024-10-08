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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { onRentModel } from "../../../api/model/book";
import { GetOnRent } from "../../../api/fetch/getOnRent";
import { useToast } from "@/components/ui/use-toast";
import { PostRent } from "../../../api/fetch/postRent";
import { useState, useEffect } from "react";
import React from "react";
import { getCookie } from "cookies-next";
import { UpdateReturn } from "../../../api/fetch/updateReturn";

export function BookTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<onRentModel[]>([]);
  const { toast } = useToast();
  const columns: ColumnDef<onRentModel>[] = [
    {
      accessorKey: "peminjaman_id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("peminjaman_id")}</div>,
    },
    {
      accessorKey: "isbn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          ISBN
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("isbn")}</div>
      ),
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
      accessorKey: "pengarang",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Author
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("pengarang")}</div>
      ),
    },
    {
      accessorKey: "peminjam",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Borrower
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("peminjam")}</div>
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
      header: "Durasi Peminjaman",
      cell: ({ row }) => <div>{row.getValue("durasi_peminjaman_in_days")}</div>,
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const token = getCookie('token');

        const handleReturn = async (id: number) => {
            console.log(id);
            try {
                if(token){
                    const request = await UpdateReturn(id, token);

                    if(request){
                        toast({
                            title: "Success",
                            description: "Book has been returned",
                        });
                        fetchOnRent();
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
        }
        return (
          <>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" size="sm">
                  Return
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to return this book?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will return the book to the library
                    and record it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleReturn(row.getValue("peminjaman_id"))}
                  >Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
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

  const fetchOnRent = async () => {
    try {
      const data = await GetOnRent();
      setData(data);
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
    fetchOnRent();
  }, [toast]);

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
