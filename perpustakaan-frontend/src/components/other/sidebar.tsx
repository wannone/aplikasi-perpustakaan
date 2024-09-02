"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { getAuth } from "../../../api/fetch/getAuth";
import { useToast } from "../ui/use-toast";
import { ReactNode } from "react";

export const Sidebar = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [roleId, setRoleId] = useState<number | null>(null); // Ensure it's null initially
  const token = getCookie("token");
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        if (token) {
          const request = await getAuth(token);
          setRoleId(request.role_id);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    fetchAuth();
  }, [token, toast]);

  // Early return to avoid rendering the sidebar on auth routes
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen ml-[240px] bg-gray-100">
      <aside className="fixed top-0 left-0 z-20 h-screen w-64 bg-background text-foreground shadow-md border-r border-gray-200">
        <div className="flex items-center justify-center h-16 bg-background-muted">
          <h1 className="text-xl font-bold text-foreground">Library System</h1>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <Button
            variant="link"
            onClick={() => router.push("/")}
            className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
          >
            Catalog
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/userRentHistory")}
            className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
          >
            User Rent History
          </Button>
          {(roleId === 1 || roleId === 2) && (
            <>
             <Button
                variant="link"
                onClick={() => router.push("/librarianRentHistory")}
                className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
              >
                Librarian Rent History
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/book")}
                className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
              >
                Books
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/category")}
                className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
              >
                Categories
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/rent")}
                className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
              >
                Rent
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/return")}
                className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
              >
                Return
              </Button>
            </>
          )}
          {roleId === 1 && (
            <Button
              variant="link"
              onClick={() => router.push("/user")}
              className="text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition duration-300"
            >
              Users
            </Button>
          )}
        </nav>
      </aside>
      {children}
    </main>
  );
};
