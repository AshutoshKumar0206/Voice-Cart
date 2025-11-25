"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Grab email/password from URL if present
  const emailFromUrl = searchParams.get("email") || "";
  const passwordFromUrl = searchParams.get("password") || "";
  const signIn = searchParams.get("success") || "";

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Set form values if URL params exist
  useEffect(() => {
    if (emailFromUrl) form.setValue("email", emailFromUrl);
    if (passwordFromUrl) form.setValue("password", passwordFromUrl);
  }, [emailFromUrl, passwordFromUrl, form]);

  const onSubmit = useCallback(
    async (data: SignInFormValues) => {
      try {
        setServerError(null);
        const res = await axiosClient.post("/user/signin", data);
        if (res.status === 200) {
          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          toast.error("Login failed. Try again.");
        }
      } catch (err: any) {
        setServerError(err?.response?.data?.message || "Login failed");
      }
    },
    [router]
  );
  useEffect(() => {
    if (signIn === "true") {
      const values = form.getValues(); // grab current form values
      onSubmit(values); // call your submit handler directly
    }
  }, [signIn, form, onSubmit]);

  return (
    <section className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-12">
      <Card className="w-full max-w-md border border-gray-200 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="text-gray-700 text-base px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className="relative">
                      <div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="text-gray-700 text-base px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md py-2 rounded-lg transition-all"
                type="submit"
              >
                Sign In
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
