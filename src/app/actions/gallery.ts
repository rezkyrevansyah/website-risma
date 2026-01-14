'use server'

import { createClient } from '@/lib/supabase/server'
import { GalleryItem } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getGalleries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching galleries:', error)
    return []
  }

  return data as GalleryItem[]
}

export async function getLatestGalleryItem() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        console.error('Error fetching latest gallery item:', error)
    }
    return null
  }

  return data as GalleryItem
}

export async function createGallery(item: Omit<GalleryItem, 'id' | 'likes'>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      src: item.src,
      alt: item.alt,
      caption: item.caption,
      category: item.category,
    })
    .select()

  if (error) {
    console.error('Error creating gallery:', error)
    throw new Error(`Failed to create gallery item: ${error.message} (${error.code})`)
  }
  
  revalidatePath('/')
  revalidatePath('/admin/galeri')
  return { success: true, data }
}

export async function deleteGallery(id: string) {
  const supabase = await createClient()

  // 1. Get the item first to find the image URL
  const { data: item, error: fetchError } = await supabase
    .from('gallery')
    .select('src')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching item to delete:', fetchError)
    // We proceed to try deleting the record anyway, or throw? 
    // Usually best to fail if we can't find it.
    throw new Error('Item not found')
  }

  // 2. Extract filename from URL
  if (item?.src) {
    try {
      const url = new URL(item.src)
      const pathParts = url.pathname.split('/')
      // Assuming URL structure: .../storage/v1/object/public/images/filename.jpg
      // The last part is the filename
      const fileName = pathParts[pathParts.length - 1]
      
      if (fileName) {
         const { error: storageError } = await supabase
            .storage
            .from('images')
            .remove([fileName])

         if (storageError) {
            console.error('Error deleting file from storage:', storageError)
            // We verify if we should block the DB deletion. 
            // Usually we might want to log it but still delete the DB record to avoid "ghost" records.
         }
      }
    } catch (e) {
      console.error('Error parsing URL for deletion:', e)
    }
  }
  
  // 3. Delete from DB
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (error) {
     console.error('Error deleting gallery:', error)
     throw new Error('Failed to delete gallery item')
  }
  
  revalidatePath('/')
  revalidatePath('/admin/galeri')
}
