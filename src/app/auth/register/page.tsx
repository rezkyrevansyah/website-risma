import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun | Website Risma",
  description: "Daftar akun baru untuk Website Remaja Masjid.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
