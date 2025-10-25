"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function EmailVerificationPage() {
  const { handleSubmit, setValue } = useForm();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = () => {
    alert(`Submitted OTP: ${otp.join("")}`);
    // handle verify request here
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4 py-12">
      <Card className="w-full max-w-md border border-gray-200 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Verify Your Email
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground mt-2">
            We&apos;ve sent a 6-digit verification code to your email.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleBackspace(i, e)}
                    className={clsx(
                      "w-12 h-12 text-center text-xl font-mono tracking-wide",
                      "border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                    )}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md py-2 rounded-lg transition-all"
            >
              Verify
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Didn’t receive the code?{" "}
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
              onClick={() => alert("Resend OTP logic goes here")}
            >
              Resend
            </button>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
