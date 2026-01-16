import { Variants } from "framer-motion";

/**
 * Premium Transition Configuration
 * tuned for a "luxury" feel - responsive yet weighted.
 */
export const transitions = {
    // Smooth, elegant spring for layout transitions
    layout: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
    } as const,
    // Snappier spring for hover interactions
    spring: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
    } as const,
    // Linear easing for continuous loops
    linear: {
        ease: "linear",
        duration: 10,
        repeat: Infinity,
    } as const,
};

/**
 * Stagger Container
 * Use this on parent elements to sequence children animations.
 */
export const staggerContainer = (
    staggerChildren: number = 0.1,
    delayChildren: number = 0
): Variants => ({
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

/**
 * Fade Up Variant
 * Standard "premium" entrance animation.
 */
export const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            ...transitions.layout,
        },
    },
};

/**
 * Fade In Variant (No movement)
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom bezier for smooth fade
        },
    },
};

/**
 * Scale In Variant
 * Great for cards or images.
 */
export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            ...transitions.layout,
        },
    },
};

/**
 * Slide In From Right
 * Good for sidebars or off-canvas menus.
 */
export const slideInRight: Variants = {
    hidden: { x: "100%", opacity: 0 },
    show: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        x: "100%",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
};
