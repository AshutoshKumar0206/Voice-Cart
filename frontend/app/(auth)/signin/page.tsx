"use client";

import { Suspense } from "react";
import SignInPage from "./SignInPage";

export default function SignInWrapper() {
  return (
    <Suspense>
      <SignInPage />
    </Suspense>
  );
}
