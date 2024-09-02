'use client'
import { ReactNode, useEffect, useState } from "react";
import { getAuth } from "../../../api/fetch/getAuth";
import { deleteCookie, getCookie } from "cookies-next";
import { useToast } from "../ui/use-toast";
import { logout } from "../../../api/fetch/logout";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = ({children}: { children: ReactNode }) => {
  const [data, setData] = useState<{nama : string, email: string}>({
    nama: "",
    email: "",
  });
  const token = getCookie("token");
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const request = await getAuth(token);
          setData({
            nama: request.nama,
            email: request.email,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
      }
    }

    fetchData();
  }, [token]);

  const handleSignOut = async () => {
    try {
      if (token) {
        const request = await logout(token);
        if (request) {
          toast({
            title: "Success",
            description: "Logout Success"
          })
          deleteCookie("token");
          router.push("/login");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

    return (
      <>
      <header className="sticky top-0 z-10 w-full bg-background/95 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="mx-4 sm:mx-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">{data.nama}</h1>
              <p className="text-sm text-gray-500">{data.email}</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-primary-dark transition duration-300"
          onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </header>
      {children}
      </>
    );
  }
  