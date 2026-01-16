'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DonationInfo } from '@/types'

export interface DonationSettings extends DonationInfo {
  id: number
}

export async function getDonationSettings() {
  const supabase = await createClient()
  
  // Fetch the first row, regardless of ID
  const { data, error } = await supabase
    .from('donation_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching donation settings:', error)
    return null
  }

  // Map snake_case from DB to camelCase for app
  return {
    id: data.id, // Store ID for future updates
    bankName: data.bank_name,
    accountNumber: data.account_number,
    holderName: data.holder_name,
    goalAmount: data.goal_amount,
    currentAmount: data.current_amount,
  } as DonationSettings
}

export async function updateDonationSettings(data: DonationInfo) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
     throw new Error("Unauthorized: You must be logged in to update donation settings.")
  }


  // Map camelCase from app to snake_case for DB
  const dbData = {
    bank_name: data.bankName,
    account_number: data.accountNumber,
    holder_name: data.holderName,
    goal_amount: data.goalAmount,
    current_amount: data.currentAmount,
    updated_at: new Date().toISOString()
  }

  // Check if a row already exists
  const existing = await getDonationSettings();

  let error;
  
  if (existing) {
    // Update existing row
    const result = await supabase
      .from('donation_settings')
      .update(dbData)
      .eq('id', existing.id)
    error = result.error;
  } else {
    // Insert new row (let DB generate ID)
    const result = await supabase
      .from('donation_settings')
      .insert(dbData)
    error = result.error;
  }

  if (error) {
    console.error('Error updating donation settings:', error)
    throw new Error('Failed to update donation settings: ' + error.message)
  }

  revalidatePath('/', 'layout') 
  return { success: true }
}
