"use client";

import { useActionState, useState, useEffect } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";

type ActionState = {
  message?: string;
  error?: {
    email?: string[];
    password?: string[];
  };
};

const initialState: ActionState = {
  message: "",
  error: undefined,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  // const router = useRouter(); // Unused

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Masuk Akun</h2>
        <p className="text-muted-foreground">
          Masukkan email dan password untuk mengakses dashboard.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email atau Username</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Email atau Username"
            required
            className="h-11 bg-background/50 backdrop-blur-sm"
          />
          {state?.error?.email && (
            <p className="text-sm text-destructive">{state.error.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
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

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium btn-shine mt-6"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk Sekarang"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
        >
          Daftar disini
        </Link>
      </div>
    </div>
  );
}
