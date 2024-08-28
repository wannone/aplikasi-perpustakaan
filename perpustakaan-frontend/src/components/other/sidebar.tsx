'use client';
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation'

export const Sidebar = () => {
  const router = useRouter()

  return (
    <aside className="fixed top-0 left-0 z-20 h-screen w-64 bg-background text-foreground shadow-md border-r border-gray-200">
      <div className="flex items-center justify-center h-16 bg-background-muted">
        <h1 className="text-xl font-bold text-foreground">Library System</h1>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Button variant="link"
        onClick={() => router.push('/')}
        className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300">
          Dashboard
        </Button>
        <Button variant="link" 
        onClick={() => router.push('/book')}
        className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300">
          Books
        </Button>
        <Button variant="link" 
        onClick={() => router.push('/category')}
        className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
        >
          Categories
        </Button>
        <Button variant="link" 
        onClick={() => router.push('/user')}
        className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
        >
          Users
        </Button>
      </nav>
    </aside>
  );
}
