export interface NavItem {
  label: string;
  href: string;
}

export type EventCategory = "kajian" | "olahraga" | "sosial" | "lainnya";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  description: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // HTML content
  category: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

export type GalleryCategory = "kajian" | "santunan" | "outdoor" | "festive";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  likes: number;
  category: GalleryCategory;
}

export interface DonationInfo {
  bankName: string;
  accountNumber: string;
  holderName: string;
  goalAmount: number;
  currentAmount: number;
}
