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
import { UserModel } from '../../../api/model/user';
import { GetAllUser } from '../../../api/fetch/getAllUser';
  
  export const UserTable = ({ refreshTable }: { refreshTable: boolean }) => {
    const [data, setData] = useState<UserModel[]>([]);
    const router = useRouter();

    const fetchUser = async () => {
        try {
         const data = await GetAllUser();
          setData(data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

    useEffect(() => {
      fetchUser();
    }, [refreshTable]);

    const handleDelete = async (id: number) => {
        try {
            fetchUser();
        } catch (error) {
            console.error("Error deleting user:", error);
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
                Name
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Email
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Role
              </TableHead>
              <TableHead className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.user_id} className="border-t border-gray-200">
                <TableCell className="px-4 py-2 text-sm text-gray-600 font-medium">
                  {user.nama}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                    {user.role}
                </TableCell>
                <TableCell className="px-4 py-2 flex gap-2 justify-end">
                  <Button variant="default" className="text-sm px-3 py-1.5"
                    onClick={() => handleEdit(user.user_id)}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" className="text-sm px-3 py-1.5"
                    onClick={() => handleDelete(user.user_id)}
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
  