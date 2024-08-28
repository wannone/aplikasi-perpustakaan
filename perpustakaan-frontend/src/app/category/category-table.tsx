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
  import { Category } from "../../../api/model/category";
  import { GetAllCategory } from "../../../api/fetch/getAllCategory";
import { useEffect, useState } from "react";
import { DeleteCategory } from "../../../api/fetch/deleteCategory";
  
  export const CategoryTable = ({ refreshTable }: { refreshTable: boolean }) => {
    const [data, setData] = useState<Category[]>([]);
    const router = useRouter();

    const fetchCategory = async () => {
        try {
          const data = await GetAllCategory();
          setData(data);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

    useEffect(() => {
      fetchCategory();
    }, [refreshTable]);

    const handleDelete = async (id: number) => {
        try {
            await DeleteCategory(id);
            fetchCategory();
        } catch (error) {
            console.error("Error deleting category:", error);
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
                ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Name
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Availability
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category.kategori_id} className="border-t border-gray-200">
                <TableCell className="px-4 py-2 text-sm text-gray-600 font-medium">
                  {category.kategori_id}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                  {category.nama}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                  {category.is_available ? "Available" : "Not Available"}
                </TableCell>
                <TableCell className="px-4 py-2 flex gap-2 justify-end">
                  <Button variant="default" className="text-sm px-3 py-1.5"
                    onClick={() => handleEdit(category.kategori_id)}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" className="text-sm px-3 py-1.5"
                    onClick={() => handleDelete(category.kategori_id)}
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
  