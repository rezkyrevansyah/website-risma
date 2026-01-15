"use client";

import { useActionState, useState, useEffect } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ActionState = {
  message?: string;
  error?: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
};

const initialState: ActionState = {
  message: "",
  error: undefined,
  success: false,
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/auth/login");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Buat Akun Baru</h2>
        <p className="text-muted-foreground">
          Daftarkan akun untuk mulai mengelola konten website.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nama Lengkap Admin"
            required
            className="h-11 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username_admin"
            required
            className="h-11 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            className="h-11 bg-background/50 backdrop-blur-sm"
          />
          {state?.error?.email && (
            <p className="text-sm text-destructive">{state.error.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="h-11 bg-background/50 backdrop-blur-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {state?.error?.password && (
            <p className="text-sm text-destructive">{state.error.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            className="h-11 bg-background/50 backdrop-blur-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium btn-shine mt-6"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
        >
          Masuk disini
        </Link>
      </div>
    </div>
  );
}
