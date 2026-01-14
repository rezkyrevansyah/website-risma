"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { EventItem, ArticleItem, GalleryItem } from "@/types";
import { createEvent, updateEvent, deleteEvent as deleteEventAction } from "@/app/actions/events";
import { createArticle, updateArticle, deleteArticle as deleteArticleAction } from "@/app/actions/articles";
import { createGallery, deleteGallery as deleteGalleryAction } from "@/app/actions/gallery";

interface AdminContextType {
  events: EventItem[];
  articles: ArticleItem[];
  galleries: GalleryItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setArticles: React.Dispatch<React.SetStateAction<ArticleItem[]>>;
  setGalleries: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  // Helpers
  addEvent: (event: EventItem) => Promise<void>;
  updateEvent: (event: EventItem) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addArticle: (article: ArticleItem) => Promise<void>;
  updateArticle: (article: ArticleItem) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateGallery: (gallery: GalleryItem) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const EMPTY_ARRAY: any[] = [];

interface AdminProviderProps {
  children: React.ReactNode;
  initialEvents?: EventItem[];
  initialArticles?: ArticleItem[];
  initialGalleries?: GalleryItem[];
}

export function AdminProvider({ 
  children,
  initialEvents = EMPTY_ARRAY,
  initialArticles = EMPTY_ARRAY,
  initialGalleries = EMPTY_ARRAY
}: AdminProviderProps) {
  // Initialize state with props
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [articlesState, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [galleries, setGalleries] = useState<GalleryItem[]>(initialGalleries);

  // Sync state with props when they change (revalidation)
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  useEffect(() => {
    setGalleries(initialGalleries);
  }, [initialGalleries]);

  // Helper functions
  const addEvent = async (event: EventItem) => {
    // Optimistic update
    setEvents((prev) => [event, ...prev]);
    try {
        await createEvent(event);
    } catch (error) {
        console.error("Failed to add event", error);
        // Rollback? For now simple optimistic or just rely on revalidate
    }
  };

  const updateEventFn = async (event: EventItem) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    try {
        await updateEvent(event);
    } catch (error) {
        console.error("Failed to update event", error);
    }
  };

  const deleteEventFn = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
        await deleteEventAction(id);
    } catch (error) {
        console.error("Failed to delete event", error);
    }
  };

  const addArticle = async (article: ArticleItem) => {
    setArticles((prev) => [article, ...prev]);
    try {
        await createArticle(article);
    } catch (error) {
        console.error("Failed to add article", error);
    }
  };

  const updateArticleFn = async (article: ArticleItem) => {
    setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)));
    try {
        await updateArticle(article);
    } catch (error) {
        console.error("Failed to update article", error);
    }
  };

  const deleteArticleFn = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    try {
        await deleteArticleAction(id);
    } catch (error) {
        console.error("Failed to delete article", error);
    }
  };

  // Gallery actions - assuming we want to use server actions here too
  const updateGallery = async (gallery: GalleryItem) => {
     // Gallery update might not be implemented in server actions yet, 
     // but keeping signature. If no action, just state.
     setGalleries((prev) => prev.map((g) => (g.id === gallery.id ? gallery : g)));
  };

  const deleteGalleryFn = async (id: string) => {
    setGalleries((prev) => prev.filter((g) => g.id !== id));
    try {
        await deleteGalleryAction(id);
    } catch (error) {
        console.error("Failed to delete gallery", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        events,
        articles: articlesState,
        galleries,
        setEvents,
        setArticles,
        setGalleries,
        addEvent,
        updateEvent: updateEventFn,
        deleteEvent: deleteEventFn,
        addArticle,
        updateArticle: updateArticleFn,
        deleteArticle: deleteArticleFn,
        updateGallery,
        deleteGallery: deleteGalleryFn,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
