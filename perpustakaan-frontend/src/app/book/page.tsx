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
  FormLabel,
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
import { useToast } from '@/components/ui/use-toast';
import { getCookie } from "cookies-next";

const formSchema = z.object({
  nama: z.string().min(2).max(255),
  kategori_id: z.coerce.number(),
  isbn: z.string().min(2).max(255),
  pengarang: z.string().min(2).max(255),
  sinopsis: z.string().min(2),
  stok: z.coerce.number().min(1),
  foto: z.any().optional(),
});

export default function Category() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const edit = searchParams.get("edit");
  const [refreshTable, setRefreshTable] = useState(false);
  const [category, setCategory] = useState<CategoryModel[]>([]);
  const { toast } = useToast();
  const token = getCookie('token');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      kategori_id: 0,
      isbn: "",
      pengarang: "",
      sinopsis: "",
      stok: 0,
      foto: null,
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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
        }
      };

      fetchCategoryData();
    }

    const fetchCategory = async () => {
      try {
        const data = await GetAllCategory();
        setCategory(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
      }
    };

    fetchCategory();
  }, [isEdit, edit]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
    formData.append("nama", values.nama);
    formData.append("kategori_id", values.kategori_id.toString());
    formData.append("isbn", values.isbn);
    formData.append("pengarang", values.pengarang);
    formData.append("sinopsis", values.sinopsis);
    formData.append("stok", values.stok.toString());
    if (values.foto) {
      formData.append("foto", values.foto);
    }

    //Debug: log FormData contents
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    if(token){
      if (isEdit && edit) {
          const request = await UpdateBook(edit, formData, token);
        if (request) {
          toast({
            title: "Success",
            description: "Edit Book Success"
          });
          router.push("/book");
          setRefreshTable((prev) => !prev);
          form.reset();
          form.setValue("foto", null);
        }
        return;
      }
        const request = await PostBook(formData, token);
      if (request) {
        toast({
          title: "Success",
          description: "Add Book Success"
        })
        setRefreshTable((prev) => !prev);
        form.reset();
        form.setValue("foto", null);
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
  }

  return (
    <>
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
                  name="kategori_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
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
                                            <FormLabel>ISBN</FormLabel>
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
                      <FormLabel>Author</FormLabel>
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
                    <FormLabel>Synopsis</FormLabel>
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
                      <FormLabel>Stock</FormLabel>
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
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Upload Image"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }}
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
                      : " ",
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
    </>
  );
}
