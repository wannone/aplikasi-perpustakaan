import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Register } from "../../../api/fetch/register";
const formSchema = z.object({
  nama: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  password_confirmation: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        const request = await Register(data);
        if (request) {
            toast({
                title: "Success",
                description: "Register success",
            });
            router.push("/login");
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Register</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="nama"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Nama
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="nama"
                        {...field}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
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
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
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
                <FormField
                    name="password_confirmation"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700">
                        Confirm Password
                        </FormLabel>
                        <FormControl>
                        <Input
                            id="password_confirmation"
                            type="password"
                            {...field}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Confirm Password"
                        />
                        </FormControl>
                        <FormMessage className="text-red-500 mt-1 text-sm" />
                    </FormItem>
                    )}
                />
              <Button
                type="submit"
                className="w-full py-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2"
              >
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
  );
}

