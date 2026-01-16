import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface AccessibleCardProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

/**
 * Accessible Card Component
 * Fixes "NO_LCP" and ARIA violations by using a semantic <button> instead of <div type="button">.
 * Includes focus styles and keyboard support automatically.
 */
export const AccessibleCard = React.forwardRef<HTMLButtonElement, AccessibleCardProps>(
    ({ children, className, onClick, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                onClick={onClick}
                type="button"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "group relative w-full overflow-hidden rounded-2xl bg-white text-left shadow-lg ring-offset-2 transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

AccessibleCard.displayName = "AccessibleCard";
