'use server'

import { createClient } from '@/lib/supabase/server'
import { EventItem } from '@/types'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  time: z.string().min(1, "Waktu wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  category: z.enum(["kajian", "olahraga", "sosial", "lainnya"]),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  imageUrl: z.string().optional(),
})

export async function getEvents(limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true }) // Ascending for upcoming events

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    category: item.category,
    description: item.description,
    imageUrl: item.image_url,
  })) as EventItem[]
}

export async function getLatestEvent() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
     if (error.code !== 'PGRST116') {
        console.error('Error fetching latest event:', error)
     }
     return null
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    time: data.time,
    location: data.location,
    category: data.category,
    description: data.description,
    imageUrl: data.image_url,
  } as EventItem
}

export async function getEventById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
     // Ignore "no rows returned" (PGRST116) and "invalid input syntax for type uuid" (22P02)
     if (error.code !== 'PGRST116' && error.code !== '22P02') {
        console.error('Error fetching event by id:', error.message, error.details || '')
     }
     return null
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    time: data.time,
    location: data.location,
    category: data.category,
    description: data.description,
    imageUrl: data.image_url,
  } as EventItem
}

export async function createEvent(item: Omit<EventItem, 'id'>) {
    const supabase = await createClient()

    // 1. Verify Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized")

    // 2. Validate Input
    const parseResult = eventSchema.safeParse(item)
    if (!parseResult.success) throw new Error("Validation failed: " + JSON.stringify(parseResult.error.flatten().fieldErrors))

    
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: item.title,
        date: item.date,
        time: item.time,
        location: item.location,
        category: item.category,
        description: item.description,
        image_url: item.imageUrl,
      })
      .select()
  
    if (error) {
      console.error('Error creating event:', error)
      throw new Error(`Failed to create event: ${error.message}`)
    }
    
    revalidatePath('/')
    revalidatePath('/admin/agenda')
    return { success: true, data }
}

export async function updateEvent(item: EventItem) {
    const supabase = await createClient()

    // 1. Verify Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized")

    // 2. Validate Input
    const parseResult = eventSchema.safeParse(item)
    if (!parseResult.success) throw new Error("Validation failed: " + JSON.stringify(parseResult.error.flatten().fieldErrors))

    
    const { data, error } = await supabase
      .from('events')
      .update({
        title: item.title,
        date: item.date,
        time: item.time,
        location: item.location,
        category: item.category,
        description: item.description,
        image_url: item.imageUrl,
      })
      .eq('id', item.id)
      .select()
  
    if (error) {
      console.error('Error updating event:', error)
      throw new Error(`Failed to update event: ${error.message}`)
    }
    
    revalidatePath('/')
    revalidatePath('/admin/agenda')
    return { success: true, data }
}

export async function deleteEvent(id: string) {
    const supabase = await createClient()

    // 1. Verify Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error("Unauthorized")

  
    // Optional: delete image if exists (similar to articles)
    // Assuming image_url logic matches
  
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
  
    if (error) {
       console.error('Error deleting event:', error)
       throw new Error('Failed to delete event')
    }
    
    revalidatePath('/')
    revalidatePath('/admin/agenda')
}
