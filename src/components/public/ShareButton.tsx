"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href, // This works in client component
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      className="h-12 w-full rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 font-semibold"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share Event
    </Button>
  );
}
