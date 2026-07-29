import { useEffect, useRef, useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * FloatingContactBar
 * Persistent, clear-glass floating footer with two side-by-side CTAs:
 *   1. Call George  -> tel:+14062390850
 *   2. Email Us      -> mailto:golfnbuzz57@icloud.com
 *
 * - Verified against every other call CTA on the site (nav, hero, footer),
 *   which all use tel:+14062390850 (406-239-0850).
 * - Glassmorphism panel matches the existing nav/back-to-top visual language
 *   (frosted, translucent, subtle border + inner highlight).
 * - Safe-area aware (iPhone home indicator / Android gesture bar) via
 *   .floating-contact-bar rules in viewport-compatibility.css.
 * - Meets 44px minimum touch target on both buttons.
 * - Hides on scroll-down, reappears on scroll-up (same behavior as the
 *   top nav), so it doesn't permanently cover content while reading.
 *   Always stays visible near the very top and very bottom of the page.
 */
const PHONE_TEL = 'tel:+14062390850';
const PHONE_DISPLAY = '(406) 239-0850';
const EMAIL_ADDRESS = 'golfnbuzz57@icloud.com';

const FloatingContactBar = () => {
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY.current;
            const docHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const distanceFromBottom = docHeight - (currentScrollY + viewportHeight);

            // Always show near the top of the page, or once the user is
            // close to the bottom (footer / contact form area).
            if (currentScrollY < 120 || distanceFromBottom < 400) {
                setIsHidden(false);
            } else if (scrollDelta > 6) {
                // Scrolling down with enough intent -> hide
                setIsHidden(true);
            } else if (scrollDelta < -6) {
                // Scrolling up -> reveal
                setIsHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className="floating-contact-bar fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
            initial={{ y: 80, opacity: 0 }}
            animate={isHidden ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ pointerEvents: isHidden ? 'none' : 'auto' }}
        >
            <div
                className="pointer-events-auto w-full max-w-md sm:max-w-lg rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl"
                style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
                role="group"
                aria-label="Quick contact options"
            >
                <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-2.5">
                    <motion.a
                        href={PHONE_TEL}
                        className="flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:brightness-110"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        aria-label={`Call George at ${PHONE_DISPLAY}`}
                    >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">Call George</span>
                    </motion.a>

                    <motion.a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/30"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        aria-label={`Email us at ${EMAIL_ADDRESS}`}
                    >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="truncate">Email Us</span>
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
};

export default FloatingContactBar;
