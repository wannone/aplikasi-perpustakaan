"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { getAuth } from "../../../api/fetch/getAuth";
import { useToast } from "../ui/use-toast";

export const Sidebar = () => {
  const router = useRouter();
  const [roleId, setroleId] = useState(0);
  const token = getCookie("token");
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        if (token) {
          const request = await getAuth(token);
          setroleId(request.role_id);
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
  }, []);

  return (
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
        {(roleId === 1 || roleId === 2) && (
          <>
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
  );
};
