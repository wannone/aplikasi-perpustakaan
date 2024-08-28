'use client'
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";
import { CategoryTable } from "./category-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { useSearchParams  } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { PostCategory } from "../../../api/fetch/postCategory";
import { useEffect, useState } from "react";
import { GetCategoryById } from "../../../api/fetch/getCategoryById";
import { updateCategory } from "../../../api/fetch/updateCategory";

const formSchema = z.object({
  kategori: z.string().min(2).max(255),
});

export default function Category() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const edit = searchParams.get('edit')
  const [refreshTable, setRefreshTable] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kategori: "",
    },
  });

  const isEdit = Boolean(edit);

  useEffect(() => {
    if (isEdit && edit) {
      const fetchCategoryData = async () => {
        try {
          const category = await GetCategoryById(edit);
          form.setValue('kategori', category.nama);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

      fetchCategoryData();
    }
  }, [isEdit, edit]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
     try {
        if (isEdit && edit) {
            await updateCategory(edit, values.kategori);
            router.push('/category');
            setRefreshTable((prev) => !prev);
            form.reset();
            return;
        }
        await PostCategory(values.kategori);
        setRefreshTable((prev) => !prev);
        form.reset();
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Categories</h1>
          {isEdit && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4 flex justify-between items-center">
                You are editing a category
                <Button variant={'destructive'}
                onClick={() => {
                    router.push('/category')
                    form.reset()
                }}
                >
                    X
                </Button>                
                </div>
                )}
          <div className="bg-white shadow-md rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="kategori"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter category"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={cn("w-full", "text-white", isEdit ? "bg-amber-400 hover:bg-amber-500" : "bg-blue-400 hover:bg-blue-500", "transition", "duration-300")}
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <CategoryTable refreshTable={refreshTable} />
          </div>
        </div>
      </main>
    </>
  );
}
