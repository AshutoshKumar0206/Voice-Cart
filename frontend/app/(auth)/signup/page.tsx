"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axiosClient from "@/lib/axios";
import { useRouter } from "next/navigation";
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

// Zod schema (no confirm password)
const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one digit")
    .regex(/[^A-Za-z0-9]/, "Must include one special character"),
});

// Score password strength
const getPasswordScore = (pwd: string) => {
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  return score; // score from 0 to 5
};

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const strengthScore = getPasswordScore(password);

  const strengthText =
    strengthScore <= 2
      ? "Weak"
      : strengthScore === 3 || strengthScore === 4
      ? "Medium"
      : "Strong";

  const strengthColor =
    strengthScore <= 2
      ? "bg-red-500"
      : strengthScore === 3 || strengthScore === 4
      ? "bg-yellow-500"
      : "bg-green-600";

  const strengthWidth = {
    0: "w-[0%]",
    1: "w-[20%]",
    2: "w-[40%]",
    3: "w-[60%]",
    4: "w-[80%]",
    5: "w-[100%]",
  }[strengthScore];

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setServerError(null);

      const res = await axiosClient.post("/user/signup", data);

      if (res.status === 201) {
        toast.success("Account created successfully! Please verify your email.");
        router.push(`/verify-email?email=${data.email}`);
      } else {
        toast.error("Signup failed. Try again.");
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Signup failed. Try again.");
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <section className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-12">
      <Card className="w-full max-w-md border border-gray-200 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Create an Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password + Strength Meter */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                          className="pr-10"
                        />
                      </FormControl>

                      {/* Toggle Show */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {/* Strength Meter */}
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strengthColor} transition-all duration-300 ${strengthWidth}`}
                          />
                        </div>
                        <p className="text-xs mt-1 text-gray-700 font-medium">
                          Strength:{" "}
                          <span
                            className={
                              strengthScore <= 2
                                ? "text-red-600"
                                : strengthScore <= 4
                                ? "text-yellow-600"
                                : "text-green-600"
                            }
                          >
                            {strengthText}
                          </span>
                        </p>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Server error */}
              {serverError && <p className="text-sm text-red-600">{serverError}</p>}

              {/* Submit */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
