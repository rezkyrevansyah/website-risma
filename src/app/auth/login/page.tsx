import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Akun | Website Risma",
  description: "Masuk ke dashboard admin Website Remaja Masjid.",
};

export default function LoginPage() {
  return <LoginForm />;
}
