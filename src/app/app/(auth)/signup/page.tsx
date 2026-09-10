import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "@/components/app/auth/signup-form";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
