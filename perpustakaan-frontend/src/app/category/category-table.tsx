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
  import { Button } from "@/components/ui/button";
  import { CategoryModel } from "../../../api/model/category";
  import { GetAllCategory } from "../../../api/fetch/getAllCategory";
import { useEffect, useState } from "react";
import { DeleteCategory } from "../../../api/fetch/deleteCategory";
import { useToast } from '@/components/ui/use-toast';
import { getCookie } from 'cookies-next';
  
  export const CategoryTable = ({ refreshTable }: { refreshTable: boolean }) => {
    const [data, setData] = useState<CategoryModel[]>([]);
    const router = useRouter();
    const {toast} = useToast();
    const token = getCookie('token');

    const fetchCategory = async () => {
        try {
          const data = await GetAllCategory();
          setData(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
        }
      };

    useEffect(() => {
      fetchCategory();
    }, [refreshTable]);

    const handleDelete = async (id: number) => {
        try {
            if(token) {
              const request = await DeleteCategory(id, token);
            if (request) {
              toast({
                title: "Success",
                description: "Delete Category Success"
              })
              fetchCategory();
            }
            }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
          });
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
                  <Button variant="default" className="text-sm px-3 py-1.5 bg-amber-400 hover:bg-amber-500"
                    onClick={() => handleEdit(category.kategori_id)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="text-sm px-3 py-1.5"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the category.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="text-sm px-3 py-1.5 bg-red-500 hover:bg-red-600"
                    onClick={() => handleDelete(category.kategori_id)}
                    >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
