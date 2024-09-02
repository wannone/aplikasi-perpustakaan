import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";
import { BookTable } from "./book-table";

export default function Rent() {
  return (
    <>
        <div className="p-8">
            <h1 className="text-2xl font-semibold">Rent</h1>
            <p className="text-gray-600">Rent a book</p>
          <BookTable />
        </div>
    </>
  );
}
