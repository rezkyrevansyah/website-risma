"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile || { 
      // Fallback if profile doesn't exist yet but user does
      full_name: user.user_metadata?.full_name || "Admin",
      username: user.user_metadata?.username || "admin",
      email: user.email,
  };
}
