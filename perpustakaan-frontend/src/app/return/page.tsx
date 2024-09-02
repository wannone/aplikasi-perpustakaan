import { BookTable } from "./book-table";

export default function Rent() {
  return (
    <>
        <div className="p-8">
            <h1 className="text-2xl font-semibold">Return</h1>
            <p className="text-gray-600">Return a book</p>
          <BookTable />
        </div>
    </>
  );
}
