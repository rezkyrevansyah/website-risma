'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

  // 1. Verify Authentication - REMOVED based on user request and disabled RLS
  // const { data: { user }, error: authError } = await supabase.auth.getUser()
  // if (authError || !user) {
  //    console.error("Update failed: User not authenticated", authError)
  //    throw new Error("Unauthorized: You must be logged in to update settings.")
  // }
  
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
