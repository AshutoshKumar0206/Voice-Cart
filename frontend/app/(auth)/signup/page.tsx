"use client";

import { Suspense } from "react";
import SignUpPage from "./SignUpPage";

export default function SignUpWrapper() {
  return (
    <Suspense>
      <SignUpPage />
    </Suspense>
  );
}
