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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { BookModel } from "../../../api/model/book";
import { GetAllBooks } from "../../../api/fetch/getAllBook";
import { useToast } from "@/components/ui/use-toast";
import { PostRent } from "../../../api/fetch/postRent";
import { useState, useEffect } from "react";
import React from "react";

export function BookTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<BookModel[]>([]);
  const { toast } = useToast();
  const columns: ColumnDef<BookModel>[] = [
    {
        accessorKey: "buku_id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-left"
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("buku_id")}</div>
        ),
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
      accessorKey: "nama",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Nama
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nama")}</div>
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
      accessorKey: "stok",
      header: "Stok",
      cell: ({ row }) => <div>{row.getValue("stok")}</div>,
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const [email, setEmail] = useState("");
        const [rentDuration, setRentDuration] = useState("");
        const handleRent = async (email: string, bukuId: string, duration: string) => {
            try {
                const request = await PostRent(email, bukuId, duration);
                fetchBooks();
                if (request) {
                    toast({
                        title: "Book rented successfully",
                        description: "You have successfully rented the book",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error renting book",
                    description: (error as Error).message || "An unknown error occurred",
                    variant: "destructive",
                });
            }
         };
        return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={row.getValue("stok") === 0}
            >
              Rent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rent A Book</DialogTitle>
              <DialogDescription>
                Please fill in the form below to rent the book
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="email@email.com"
                  className="col-span-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="RentDuration" className="text-right">
                  Rent Duration
                </Label>
                <div className="col-span-3">
                  <Input
                    id="RentDuration"
                    type="number"
                    min={1}
                    max={5}
                    className="w-full"
                    value={rentDuration}
                    onChange={(e) => setRentDuration(e.target.value)}
                    placeholder="min 1 day | max 5 day"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" 
              onClick={() => handleRent(email, row.getValue("buku_id"), rentDuration)}
              >Rent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }
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

  const fetchBooks = async () => {
    try {
      const data = await GetAllBooks();
      setData(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message ||
          "An unknown error occurred while fetching books.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [toast]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name"
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.setColumnFilters([
              {
                id: "nama",
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
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
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
                      className="px-4 py-2 text-sm text-gray-600"
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
