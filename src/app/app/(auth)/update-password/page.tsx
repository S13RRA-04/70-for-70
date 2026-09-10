import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/app/auth/update-password-form";

export const metadata: Metadata = { title: "Set New Password" };

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
