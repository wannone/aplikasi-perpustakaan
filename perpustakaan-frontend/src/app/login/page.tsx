'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../../../api/fetch/login";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        const request = await login(data.email, data.password);
        if (request) {
            toast({
                title: "Success",
                description: "Login success",
            });
            router.push("/");
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

  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                        placeholder="Email address"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        {...field}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-sm" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2">
                Sign in
              </Button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
