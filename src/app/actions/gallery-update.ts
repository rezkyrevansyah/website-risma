'use server'

import { createClient } from '@/lib/supabase/server'
import { GalleryItem } from '@/types'
import { revalidatePath } from 'next/cache'

export async function updateGallery(item: GalleryItem) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('gallery')
    .update({
      src: item.src,
      alt: item.alt,
      caption: item.caption,
      category: item.category,
    })
    .eq('id', item.id)

  if (error) {
    console.error('Error updating gallery:', error)
    throw new Error('Failed to update gallery item')
  }

  revalidatePath('/admin/galeri')
  return { success: true }
}
