"use client";

import React, { createContext, useContext, useState } from "react";
import { dummyEvents, articles, galleryItems } from "@/data";
import { EventItem, ArticleItem, GalleryItem } from "@/types";

interface AdminContextType {
  events: EventItem[];
  articles: ArticleItem[];
  galleries: GalleryItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setArticles: React.Dispatch<React.SetStateAction<ArticleItem[]>>;
  setGalleries: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  // Helpers
  addEvent: (event: EventItem) => void;
  updateEvent: (event: EventItem) => void;
  deleteEvent: (id: string) => void;
  addArticle: (article: ArticleItem) => void;
  updateArticle: (article: ArticleItem) => void;
  deleteArticle: (id: string) => void;
  updateGallery: (gallery: GalleryItem) => void;
  deleteGallery: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with dummy data
  const [events, setEvents] = useState<EventItem[]>(dummyEvents);
  const [articlesState, setArticles] = useState<ArticleItem[]>(articles);
  const [galleries, setGalleries] = useState<GalleryItem[]>(galleryItems);

  // Helper functions
  const addEvent = (event: EventItem) => setEvents((prev) => [event, ...prev]);
  const updateEvent = (event: EventItem) => setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  const deleteEvent = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const addArticle = (article: ArticleItem) => setArticles((prev) => [article, ...prev]);
  const updateArticle = (article: ArticleItem) => setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)));
  const deleteArticle = (id: string) => setArticles((prev) => prev.filter((a) => a.id !== id));

  const updateGallery = (gallery: GalleryItem) => setGalleries((prev) => prev.map((g) => (g.id === gallery.id ? gallery : g)));
  const deleteGallery = (id: string) => setGalleries((prev) => prev.filter((g) => g.id !== id));

  return (
    <AdminContext.Provider
      value={{
        events,
        articles: articlesState,
        galleries,
        setEvents,
        setArticles: setArticles,
        setGalleries,
        addEvent,
        updateEvent,
        deleteEvent,
        addArticle,
        updateArticle,
        deleteArticle,
        updateGallery,
        deleteGallery,
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
