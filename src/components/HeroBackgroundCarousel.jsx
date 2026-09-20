import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HeroBackgroundCarousel
 * Rotates the hero's background photo only. The headline, CTAs, badges,
 * floating particles, and the existing `.hero-overlay` gradient are all
 * untouched — they keep rendering exactly as before, layered on top of
 * this component.
 *
 * - Crossfades between `images` (no slide/swipe motion) with a slow Ken
 *   Burns zoom on each photo for a bit of life without being distracting.
 * - Every slide is preloaded on mount so the rotation never has to wait
 *   on the network mid-fade — that's what keeps it feeling seamless.
 * - Renders ONLY the <img> layer (no wrapper div, no overlay, no dots):
 *   it's meant to sit inside the existing `absolute inset-0` hero
 *   background div, in the exact spot the old single <img> occupied.
 * - Respects prefers-reduced-motion: keeps the crossfade, skips the zoom.
 */
const SLIDE_MS = 6000;    // how long each photo holds before crossfading to the next
const FADE_SECONDS = 1.8; // crossfade duration
const ZOOM_SECONDS = SLIDE_MS / 1000 + FADE_SECONDS; // zoom spans a slide's full time on screen

const HeroBackgroundCarousel = ({ images = [], intervalMs = SLIDE_MS }) => {
    const [index, setIndex] = useState(0);

    // Preload every slide once so later crossfades never stall on the network.
    useEffect(() => {
        images.forEach(({ src }) => {
            const preload = new window.Image();
            preload.src = src;
        });
    }, [images]);

    useEffect(() => {
        if (images.length <= 1) return undefined;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [images.length, intervalMs]);

    if (!images.length) return null;

    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <AnimatePresence mode="sync" initial={false}>
            <motion.img
                key={images[index].src}
                src={images[index].src}
                alt={images[index].alt || ''}
                loading="eager"
                fetchpriority={index === 0 ? 'high' : undefined}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
                animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.15 }}
                exit={{ opacity: 0 }}
                transition={{
                    opacity: { duration: FADE_SECONDS, ease: 'easeInOut' },
                    scale: { duration: ZOOM_SECONDS, ease: 'linear' },
                }}
            />
        </AnimatePresence>
    );
};

export default HeroBackgroundCarousel;
