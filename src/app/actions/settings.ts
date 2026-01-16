'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { z } from 'zod'

export interface SiteSettings {
  id: number
  site_name: string
  tagline: string
  description: string
  address: string
  phone: string
  email: string
  whatsapp: string
  instagram: string
  facebook: string
  youtube: string
  map_url: string
}

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.error('Error fetching site settings:', error)
    return null
  }

  return data as SiteSettings
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
     console.error("Update failed: User not authenticated", authError)
     throw new Error("Unauthorized: You must be logged in to update settings.")
  }
  
  // 2. Validate Data
  const settingsSchema = z.object({
      site_name: z.string().optional(),
      tagline: z.string().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      whatsapp: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
      map_url: z.string().optional(),
  })

  const parseResult = settingsSchema.safeParse(data);
  if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error);
      throw new Error("Validation failed: " + JSON.stringify(parseResult.error.flatten().fieldErrors));
  }

  
  // 2. Perform Upsert
  const { error } = await supabase
    .from('site_settings')
    .upsert({
        ...data,
        id: 1, 
        updated_at: new Date().toISOString()
    }, { onConflict: 'id' })

  if (error) {
    console.error('Error updating site settings:', error)
    throw new Error('Failed to update site settings: ' + error.message)
  }

  revalidatePath('/', 'layout') 
  return { success: true }
}
