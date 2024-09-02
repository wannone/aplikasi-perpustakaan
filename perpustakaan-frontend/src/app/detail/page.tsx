"use client";
import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookModel } from "../../../api/model/book";
import { getBookById } from "../../../api/fetch/getBookById";
import { useToast } from "@/components/ui/use-toast";
import { GetCategoryById } from "../../../api/fetch/getCategoryById";

export default function Detail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { toast } = useToast();
  const [book, setBook] = useState<BookModel | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  if (!id) {
    router.push("/");
  }

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const book = await getBookById(id);
          const category = await GetCategoryById(book.kategori_id);
          setCategory(category.nama);
          setBook(book);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
          });
        } 
      };

      fetchBook();
    }
  }, [id]);

  return (
    <>
        <div className="p-6">
          {book ? (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex">
              <div className="w-1/3 p-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASEIMAGE}/${book.foto}`}
                  alt={book.nama}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{book.nama}</h2>
                  <p className="text-gray-700 mb-2">
                    <strong>ISBN:</strong> {book.isbn}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Kategori:</strong> {category ?? "loading..."}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Pengarang:</strong> {book.pengarang}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Sinopsis:</strong>
                  </p>
                  <p className="text-gray-700">{book.sinopsis}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    {book.stok > 0 ? (
                      <p className="text-green-600 font-semibold">
                        <strong>Available</strong> - {book.stok} in stock
                      </p>
                    ) : (
                      <p className="text-red-600 font-semibold">Out of Stock</p>
                    )}
                  </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading book details...</p>
          )}
        </div>
    </>
  );
}
