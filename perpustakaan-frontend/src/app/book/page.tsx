"use client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import { GetAllCategory } from "../../../api/fetch/getAllCategory";
import { CategoryModel } from "../../../api/model/category";
import { BookTable } from "./book-table";
import { PostBook } from "../../../api/fetch/postBook";
import { getBookById } from "../../../api/fetch/getBookById";
import { BookPostModel } from "../../../api/model/book";
import { UpdateBook } from "../../../api/fetch/updateBook";

const formSchema = z.object({
  nama: z.string().min(2).max(255),
  kategori_id: z.coerce.number(),
  isbn: z.string().min(2).max(255),
  pengarang: z.string().min(2).max(255),
  sinopsis: z.string().min(2),
  stok: z.coerce.number().min(1),
  foto: z.string().min(2).max(255),
});

export default function Category() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const edit = searchParams.get("edit");
  const [refreshTable, setRefreshTable] = useState(false);
  const [category, setCategory] = useState<CategoryModel[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      kategori_id: 0,
      isbn: "",
      pengarang: "",
      sinopsis: "",
      stok: 0,
      foto: "",
    },
  });

  const isEdit = Boolean(edit);

  useEffect(() => {
    if (isEdit && edit) {
      const fetchCategoryData = async () => {
        try {
          const book: BookPostModel = await getBookById(edit);
          form.setValue("nama", book.nama);
          form.setValue("kategori_id", book.kategori_id);
          form.setValue("isbn", book.isbn);
          form.setValue("pengarang", book.pengarang);
          form.setValue("sinopsis", book.sinopsis);
          form.setValue("stok", book.stok);
          form.setValue("foto", book.foto);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

      fetchCategoryData();
    }

    const fetchCategory = async () => {
      try {
        const data = await GetAllCategory();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [isEdit, edit]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && edit) {
        await UpdateBook(edit, values);
        router.push("/book");
        setRefreshTable((prev) => !prev);
        form.reset();
        return;
      }
      await PostBook(values);
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Book
          </h1>
          {isEdit && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4 flex justify-between items-center">
              You are editing a Book
              <Button
                variant={"destructive"}
                onClick={() => {
                  router.push("/book");
                  form.reset();
                }}
              >
                X
              </Button>
            </div>
          )}
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
                  name="kategori_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={
                            field.value.toString()
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                            {field.value ? category.find(item => item.kategori_id.toString() === field.value.toString())?.nama : "Select a category"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {category.map((item) => (
                              <SelectGroup key={item.kategori_id}>
                                <SelectItem value={item.kategori_id.toString()}>
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

                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter ISBN"
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
                  name="pengarang"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Author"
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
                  name="sinopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter synopsis"
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
                  name="stok"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter stock"
                          {...field}
                          type="number"
                          min={1}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="foto"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter image url"
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
                  className={cn(
                    "w-full",
                    "text-white",
                    isEdit
                      ? "bg-amber-400 hover:bg-amber-500"
                      : "bg-blue-400 hover:bg-blue-500",
                    "transition",
                    "duration-300"
                  )}
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <BookTable refreshTable={refreshTable} />
          </div>
        </div>
      </main>
    </>
  );
}
