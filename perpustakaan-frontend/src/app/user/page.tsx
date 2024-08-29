"use client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import { UserTable } from "./user-table";
import { GetUserById } from "../../../api/fetch/getUserById";
import { GetAllRoles } from "../../../api/fetch/getAllRoles";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleModel } from "../../../api/model/user";
import { UpdateUser } from "../../../api/fetch/updateUser";

const formSchema = z.object({
  nama: z.string().min(2).max(255),
  email: z.string().email(),
  role_id: z.coerce.number(),
});

export default function User() {
  const searchParams = useSearchParams();
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const router = useRouter();
  const edit = searchParams.get("edit");
  const [refreshTable, setRefreshTable] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      email: "",
      role_id: 0,
    },
  });

  const isEdit = Boolean(edit);

  useEffect(() => {
    if (isEdit && edit) {
      const fetchUserData = async () => {
        try {
          const data = await GetUserById(edit);
          form.setValue("nama", data.nama);
          form.setValue("email", data.email);
          form.setValue("role_id", data.role_id);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      };

      fetchUserData();
    }

    const fetchRoleData = async () => {
      try {
        const data = await GetAllRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRoleData();
  }, [isEdit, edit]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && edit) {
        await UpdateUser(values, edit);
        router.push("/user");
        setRefreshTable((prev) => !prev);
        form.reset();
        return;
      }
    } catch (error) {
      console.error("Error posting category:", error);
    }
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-screen ml-[240px] bg-gray-100">
        <Navbar />
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage User
          </h1>
          {isEdit && (
            <div>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4 flex justify-between items-center">
                You are editing a user
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    router.push("/user");
                    form.reset();
                  }}
                >
                  X
                </Button>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Name"
                              {...field}
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Email"
                              {...field}
                              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  {field.value
                                    ? roles.find(
                                        (item) =>
                                          item.role_id.toString() ===
                                          field.value.toString()
                                      )?.nama
                                    : "Select a category"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((item) => (
                                  <SelectGroup key={item.role_id}>
                                    <SelectItem
                                      value={item.role_id.toString()}
                                    >
                                      {item.nama}
                                    </SelectItem>
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className={cn(
                        "w-full",
                        "text-white",
                        isEdit
                          ? "bg-amber-400 hover:bg-amber-500"
                          : " ",
                        "transition",
                        "duration-300"
                      )}
                      disabled={!isEdit}
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}

          <div className="mt-8">
            <UserTable refreshTable={refreshTable} />
          </div>
        </div>
      </main>
    </>
  );
}
