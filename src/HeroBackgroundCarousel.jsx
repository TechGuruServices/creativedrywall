import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HeroBackgroundCarousel
 * -----------------------
 * Drop-in replacement for a single static hero background image.
 * Crossfades smoothly between a set of images, with a slow "Ken Burns"
 * zoom on each slide for a modern, cinematic feel. Content (headline,
 * CTAs, badges) sits on top in a separate layer, unaffected by the fade.
 *
 * Usage inside your existing Hero component:
 *
 *   <section className="relative min-h-screen overflow-hidden">
 *     <HeroBackgroundCarousel
 *       images={[
 *         { src: "/images/hero/thompson-house.jpg", alt: "The Thompson family home in Missoula, MT" },
 *         { src: "/images/hero/missoula-valley.jpg", alt: "Missoula valley at golden hour" },
 *         { src: "/images/hero/interior-project.jpg", alt: "Finished drywall interior project" },
 *         { src: "/images/hero/rattlesnake-creek.jpg", alt: "Rattlesnake Creek near Missoula, MT" },
 *       ]}
 *     />
 *     <div className="relative z-10"> ...existing hero content... </div>
 *   </section>
 *
 * NOTE: the wrapping <section> must have `relative` + `overflow-hidden`,
 * and your content layer must have `relative z-10` (or higher) so it
 * stacks above the carousel. The carousel itself is absolutely
 * positioned and fills its parent — it does not need its own height.
 */

const DEFAULT_INTERVAL_MS = 6000; // time each slide is fully visible before crossfading
const CROSSFADE_SECONDS = 1.8; // duration of the fade between slides
const KENBURNS_SECONDS = DEFAULT_INTERVAL_MS / 1000 + CROSSFADE_SECONDS; // slow zoom spans the slide's full life

export default function HeroBackgroundCarousel({
  images = [],
  intervalMs = DEFAULT_INTERVAL_MS,
  overlayClassName = "bg-gradient-to-b from-black/60 via-black/40 to-black/70",
  pauseOnHover = false,
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [images.length, intervalMs, isPaused]);

  // Respect users who've asked for reduced motion: still rotate images,
  // just skip the zoom/scale animation.
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!images.length) return null;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={images[index].src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSSFADE_SECONDS, ease: "easeInOut" }}
        >
          <motion.img
            src={images[index].src}
            alt={images[index].alt || ""}
            className="h-full w-full object-cover"
            initial={{ scale: prefersReducedMotion ? 1 : 1.05 }}
            animate={{ scale: prefersReducedMotion ? 1 : 1.15 }}
            transition={{ duration: KENBURNS_SECONDS, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Same dark gradient overlay your current hero uses, so text
          stays readable over every slide, not just the house photo. */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Optional: small dot indicators, bottom-right, low-key */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white/90" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
