"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const signupSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function login(prevState: any, formData: FormData) {
  const identifier = formData.get("email") as string; // We reuse 'email' field name for identifier
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({ identifier, password });

  if (!validatedFields.success) {
    return {
      error: {
        email: validatedFields.error.flatten().fieldErrors.identifier,
        password: validatedFields.error.flatten().fieldErrors.password,
      },
    };
  }

  const supabase = await createClient();
  let emailToUse = identifier;

  // Check if input is a username (no @ symbol)
  if (!identifier.includes("@")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .single();

    if (profile?.email) {
      emailToUse = profile.email;
    } else {
       // If username not found, we can try to let supabase fail, but it's better to fail early
       // Or strictly talking, we just pass it freely if we trust supabase to handle it? 
       // Supabase signInWithPassword expects email, so we MUST resolve it.
       return { message: "Username tidak ditemukan atau password salah." };
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  if (error) {
    return {
      message: "Email/Username atau password salah.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function signup(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validatedFields = signupSchema.safeParse({ fullName, username, email, password });

  if (!validatedFields.success) {
    return {
        // Map username error to a generic error field or we need to update the form to accept username error
        // For simplicity, we might just return the errors as is and handle in UI
        error: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (password !== confirmPassword) {
    return {
      message: "Konfirmasi password tidak cocok.",
    };
  }

  const supabase = await createClient();

  // Check if username exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();
  
  if (existingUser) {
    return { message: "Username sudah digunakan. Pilih username lain." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Removed emailRedirectTo as user requested no verification flow
      data: {
        full_name: fullName,
        username: username,
      }
    },
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  if (data.user) {
    // Manually insert into profiles table to ensure data integrity
    const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        username: username,
        email: email,
    });

    if (profileError) {
        console.error("Profile creation failed:", profileError);
    }
  }

  // If Supabase returns a session, it means the user is auto-confirmed/logged in
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/admin");
  }

  return {
    success: true,
    message: "Registrasi berhasil! Silakan login.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
