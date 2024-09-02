import { BookTable } from "./table";

export default function RentHistory() {
    return (
        <>
    <div className="p-8">
            <h1 className="text-2xl font-semibold">History</h1>
            <p className="text-gray-600">Rent History</p>
          <BookTable />
        </div>            
        </>
    )
}