'use client';
import { useEffect, useState } from "react";
import { Book } from "../../api/model/book";
import { GetAllBooks } from "../../api/fetch/getAllBook";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/other/sidebar";
import { Navbar } from "@/components/other/navbar";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await GetAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Filter the books based on the search term
  const filteredBooks = books.filter((book) =>
    book.nama.toLowerCase().includes(search.toLowerCase()) ||
    book.pengarang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <main className="min-h-screen ml-[240px] bg-gray-100">
        <Navbar />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">All Books</h1>
                <p className="text-gray-600 mt-1">List of all books in the library</p>
              </div>
              <Input 
                placeholder="Search book" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card
                  key={book.buku_id}
                  className="max-w-[200px] min-h-[300px] bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={book.foto || "/default-book.jpg"}
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
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
