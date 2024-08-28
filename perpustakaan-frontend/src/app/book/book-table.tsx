'use client';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Book } from '../../../api/model/book';
import { GetAllBooks } from '../../../api/fetch/getAllBook';
import { DeleteBook } from '../../../api/fetch/deleteBook';
  
  export const BookTable = ({ refreshTable }: { refreshTable: boolean }) => {
    const [data, setData] = useState<Book[]>([]);
    const router = useRouter();

    const fetchBook = async () => {
        try {
          const data = await GetAllBooks();
          setData(data);
        } catch (error) {
          console.error("Error fetching book:", error);
        }
      };

    useEffect(() => {
      fetchBook();
    }, [refreshTable]);

    const handleDelete = async (id: number) => {
        try {
            await DeleteBook(id);
            fetchBook();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleEdit = async (id: number) => {
        router.push(`?edit=${id}`);
    }
  
    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white border border-gray-300 shadow-md">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                ISBN
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Name
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Author
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                Category
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((book) => (
              <TableRow key={book.buku_id} className="border-t border-gray-200">
                <TableCell className="px-4 py-2 text-sm text-gray-600 font-medium">
                  {book.isbn}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                  {book.nama}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                 {book.pengarang}
                </TableCell>
                <TableCell className="px-4 py-2 flex gap-2 justify-end">
                  <Button variant="default" className="text-sm px-3 py-1.5"
                    onClick={() => handleEdit(book.buku_id)}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" className="text-sm px-3 py-1.5"
                    onClick={() => handleDelete(book.buku_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  