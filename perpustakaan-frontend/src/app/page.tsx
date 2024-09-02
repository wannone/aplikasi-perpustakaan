"use client";
import { useEffect, useState } from "react";
import { BookModel } from "../../api/model/book";
import { GetAllBooks } from "../../api/fetch/getAllBook";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/other/sidebar";
import { Navbar } from "@/components/other/navbar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { GetAllCategory } from "../../api/fetch/getAllCategory";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryModel } from "../../api/model/category";

export default function Home() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [Categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoryfilter, setCategoryFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const book = await GetAllBooks();
        const categories = await GetAllCategory();
        setBooks(book);
        setCategories(categories);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  var filteredBooks = books.filter(
    (book) =>
      book.nama.toLowerCase().includes(search.toLowerCase()) ||
      book.pengarang.toLowerCase().includes(search.toLowerCase()) ||
      book.kategori.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase()) 
  );

  if (categoryfilter) {
    filteredBooks = filteredBooks.filter(
      (book) => book.kategori === Categories.find(cat => cat.kategori_id === categoryfilter)?.nama
    );
  }

  return (
    <>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">All Books</h1>
                <p className="text-gray-600 mt-1">
                  List of all books in the library
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full items-end"> 
              <Input
                placeholder="Search book"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0"
              />
              <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
              <Select
                value={categoryfilter.toString()}
                onValueChange={(value) => setCategoryFilter(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue>
                  {categoryfilter ? Categories.find(cat => cat.kategori_id === categoryfilter)?.nama : "Filter by Category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">All Categories</SelectItem>
                    </SelectGroup>
                    {Categories.map((category) => (
                      <SelectGroup key={category.kategori_id}>
                                <SelectItem value={category.kategori_id.toString()}>
                                  {category.nama}
                                </SelectItem>
                              </SelectGroup>                    
                    ))}
                </SelectContent>
              </Select>
              </div>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-center text-gray-500">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Card
                    key={book.buku_id}
                    onClick={() => router.push(`/detail?id=${book.buku_id}`)}
                    className="max-w-[220px] min-h-[320px] bg-white shadow-md rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASEIMAGE}/${book.foto}`}
                        alt={book.nama}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-md font-bold text-gray-800">{book.nama}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.pengarang}</p>
                      <p className="text-sm text-gray-600 mt-1">{book.kategori}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No books found</p>
              )}
            </div>
            )}
          </div>
        </div>
    </>
  );
}
