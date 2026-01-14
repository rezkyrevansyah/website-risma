'use server'

import { createClient } from '@/lib/supabase/server'
import { ArticleItem } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getArticles(limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  // Map DB columns to ArticleItem (camelCase)
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    category: item.category,
    date: item.date,
    readingTime: item.reading_time,
    imageUrl: item.image_url,
    author: {
      name: item.author_name,
      role: item.author_role,
      avatarUrl: item.author_avatar_url || '',
    },
  })) as ArticleItem[]
}

export async function getArticleById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    date: data.date,
    readingTime: data.reading_time,
    imageUrl: data.image_url,
    author: {
      name: data.author_name,
      role: data.author_role,
      avatarUrl: data.author_avatar_url || '',
    },
  } as ArticleItem
}

export async function createArticle(item: Omit<ArticleItem, 'id'>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      date: item.date,
      reading_time: item.readingTime,
      image_url: item.imageUrl,
      author_name: item.author.name,
      author_role: item.author.role,
      author_avatar_url: item.author.avatarUrl,
    })
    .select()

  if (error) {
    console.error('Error creating article:', error)
    throw new Error(`Failed to create article: ${error.message}`)
  }
  
  revalidatePath('/')
  revalidatePath('/admin/artikel')
  revalidatePath(`/artikel/${data[0].id}`)
  return { success: true, data }
}

export async function updateArticle(item: ArticleItem) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        date: item.date,
        reading_time: item.readingTime,
        image_url: item.imageUrl,
        author_name: item.author.name,
        author_role: item.author.role,
        author_avatar_url: item.author.avatarUrl,
      })
      .eq('id', item.id)
      .select()
  
    if (error) {
      console.error('Error updating article:', error)
      throw new Error(`Failed to update article: ${error.message}`)
    }
    
    revalidatePath('/')
    revalidatePath('/admin/artikel')
    revalidatePath(`/artikel/${item.id}`)
    return { success: true, data }
  }

export async function deleteArticle(id: string) {
  const supabase = await createClient()

  // 1. Get image url to delete
  const { data: item } = await supabase
    .from('articles')
    .select('image_url')
    .eq('id', id)
    .single()

  if (item?.image_url) {
    try {
        const url = new URL(item.image_url)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        
        if (fileName) {
            await supabase.storage.from('images').remove([fileName])
        }
    } catch (e) {
        console.error('Error parsing image URL for deletion:', e)
    }
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
     console.error('Error deleting article:', error)
     throw new Error('Failed to delete article')
  }
  
  revalidatePath('/')
  revalidatePath('/admin/artikel')
}
