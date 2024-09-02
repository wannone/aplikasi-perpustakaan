"use client";
import { useRouter } from "next/navigation";
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
import { UserModel } from "../../../api/model/user";
import { GetAllUser } from "../../../api/fetch/getAllUser";
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
import { getCookie } from "cookies-next";
import { DeleteUser } from "../../../api/fetch/deleteUser";
import { useToast } from "@/components/ui/use-toast";

export const UserTable = ({ refreshTable }: { refreshTable: boolean }) => {
  const [data, setData] = useState<UserModel[]>([]);
  const router = useRouter();
  const token = getCookie('token');
  const { toast } = useToast();

  const fetchUser = async () => {
    try {
      if(token) {
        const data = await GetAllUser(token);
      setData(data);
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

  useEffect(() => {
    fetchUser();
  }, [refreshTable]);

  const handleDelete = async (id: number) => {
    try {
      if(token) {
        const request = await DeleteUser(id, token);
      if (request) {
        toast({
          title: "Success",
          description: "Delete User Success"
        })
        fetchUser();
      }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
      });    }
  };

  const handleEdit = async (id: number) => {
    router.push(`?edit=${id}`);
  };

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
                <Button
                  variant="default"
                  className="text-sm px-3 py-1.5 bg-amber-400 hover:bg-amber-500"
                  onClick={() => handleEdit(user.user_id)}
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
                        delete the user and all its record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="text-sm px-3 py-1.5 bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(user.user_id)}
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
