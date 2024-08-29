import { Navbar } from "@/components/other/navbar";
import { Sidebar } from "@/components/other/sidebar";

export default function Return() {
    return (
        <>
        <Sidebar />
        <main className="min-h-screen ml-[240px] bg-gray-100">
            <Navbar />
            <div className="p-8">
                <h1 className="text-2xl font-semibold">Return</h1>
                <p className="text-gray-600">Return a book</p>
            </div>
        </main>
        </>
    );
}