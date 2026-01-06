import { useState, useEffect, Suspense, lazy } from 'react';
import { Phone, MapPin, ShieldCheck, Hammer, Users, Star, Calendar, CheckCircle, Clock, Mail, Menu, X, Home, Briefcase, User, Image, MessageCircle, Sun, Moon, Calculator, ArrowDown, Award, Sparkles, ChevronRight, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import QuoteCalculator from './components/QuoteCalculator';

// Lazy load ChatWidget for better initial load performance
const ChatWidget = lazy(() => import('./components/ChatWidget'));

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'residential',
        propertyType: 'new-construction',
        timeline: 'asap',
        message: '',
        consultationDate: '',
        consultationTime: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavHidden, setIsNavHidden] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Hero background image (royalty-free construction image)
    const heroBackgroundImage = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80";

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide navbar on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsNavHidden(true);
            } else {
                setIsNavHidden(false);
            }

            setLastScrollY(currentScrollY);
            setScrollY(currentScrollY);

            // Update active section based on scroll position
            const sections = ['home', 'services', 'about', 'contact'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (!element) return false;
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            });
            if (currentSection) setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Theme toggle effect
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
        }
    }, [isDarkMode]);

    const services = [
        {
            icon: <Hammer className="w-8 h-8" />,
            title: "Complete Drywall Installation",
            description: "Full-service drywall installation from framing to final finish for residential and commercial properties.",
            featured: true,
            accent: "cyan"
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Repair & Restoration",
            description: "Expert repair of damaged drywall, water damage, and structural issues with lasting solutions.",
            featured: false,
            accent: "blue"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "All Phase Service",
            description: "Comprehensive drywall services including hanging, taping, texturing, and finishing for any project size.",
            featured: false,
            accent: "gold"
        }
    ];





    // Generate available consultation times (9 AM - 5 PM, every hour)


    // Generate available consultation dates (next 14 days, excluding Sundays)




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Send data to Cloudflare Pages Function
            const response = await fetch('/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    projectType: 'residential',
                    propertyType: 'new-construction',
                    timeline: 'asap',
                    message: '',
                    consultationDate: '',
                    consultationTime: ''
                });
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError(error.message || 'An error occurred while submitting your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'about', label: 'About', icon: User },

        { id: 'quote-calculator', label: 'Quote', icon: Calculator },
        { id: 'contact', label: 'Contact', icon: MessageCircle }
    ];

    // Navigation transparency based on scroll
    // Navigation transparency based on scroll
    const navBgOpacity = Math.min(0.95, 0.1 + scrollY / 200);

    return (
        <div className={`min-h-screen text-white overflow-x-hidden transition-colors duration-500 ${isDarkMode ? '' : 'light'}`}>
            {/* Enhanced Navigation */}
            <motion.nav
                className="fixed top-0 w-full z-50"
                style={{
                    background: isDarkMode
                        ? `rgba(15, 23, 42, ${navBgOpacity})`
                        : `rgba(248, 250, 252, ${navBgOpacity})`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: isDarkMode
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.08)',
                }}
                initial={{ y: -100 }}
                animate={{ y: isNavHidden ? -100 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo Image - Premium Container */}
                        <motion.a
                            href="#home"
                            className="flex items-center"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-xl ring-1 ring-black/5"
                                style={{
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Creative Drywall - Since 1976"
                                    className="h-14 md:h-16 w-auto"
                                    style={{
                                        imageRendering: 'crisp-edges',
                                        WebkitFontSmoothing: 'antialiased',
                                    }}
                                />
                            </div>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 backdrop-blur-xl ${activeSection === item.id
                                            ? 'text-white bg-white/10 border border-white/20 shadow-lg shadow-cyan-500/10'
                                            : 'text-gray-300 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15'
                                            }`}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                        {activeSection === item.id && (
                                            <motion.div
                                                className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2"
                                                layoutId="activeIndicator"
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* CTA Button with Glassmorphism */}
                        <div className="hidden md:flex items-center space-x-3">
                            <motion.a
                                href="tel:+14062390850"
                                className="px-6 py-3 rounded-xl font-semibold text-white flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg shadow-cyan-500/5"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Phone className="w-4 h-4 text-cyan-400" />
                                <span>(406) 239-0850</span>
                            </motion.a>

                            {/* Theme Toggle Button */}
                            <motion.button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="theme-toggle ml-4"
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                <AnimatePresence mode="wait">
                                    {isDarkMode ? (
                                        <motion.div
                                            key="moon"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Moon className="w-5 h-5 text-cyan-300" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="sun"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Sun className="w-5 h-5 text-amber-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden text-gray-300 hover:text-cyan-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-4 py-6 space-y-4">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${activeSection === item.id
                                                    ? 'text-cyan-300 bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
                                                    : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30'
                                                    }`}
                                                onClick={() => setIsMenuOpen(false)}
                                                whileHover={{ x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </motion.a>
                                        );
                                    })}
                                    <motion.a
                                        href="tel:+14062390850"
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                                        onClick={() => setIsMenuOpen(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>(406) 239-0850</span>
                                    </motion.a>

                                    {/* Mobile Theme Toggle */}
                                    <motion.button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-cyan-300 hover:bg-gray-800/30 w-full"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                    >
                                        {isDarkMode ? (
                                            <>
                                                <Sun className="w-5 h-5 text-amber-400" />
                                                <span>Switch to Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="w-5 h-5 text-cyan-300" />
                                                <span>Switch to Dark Mode</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* AI Chat Widget */}
            {/* AI Chat Widget - Lazy Loaded */}
            <Suspense fallback={null}>
                <ChatWidget />
            </Suspense>

            {/* Premium Hero Section */}
            <section id="home" className="pt-40 md:pt-48 lg:pt-56 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center">
                {/* Hero Background with Image */}
                <div className="absolute inset-0">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                    />
                    {/* Premium Overlay */}
                    <div className="absolute inset-0 hero-overlay"></div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    background: i % 3 === 0 ? 'rgba(34, 211, 238, 0.6)' : i % 3 === 1 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(212, 175, 55, 0.5)',
                                    left: `${10 + (i * 8) % 80}%`,
                                    top: `${15 + (i * 7) % 70}%`,
                                    filter: 'blur(1px)',
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    x: [0, i % 2 === 0 ? 15 : -15, 0],
                                    opacity: [0.3, 0.7, 0.3],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 4 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>

                    {/* Gradient Mesh Orbs */}
                    <motion.div
                        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gradient-to-l from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <motion.div
                        className="text-center max-w-5xl mx-auto"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >

                        {/* Main Heading with Enhanced Animation */}
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.span
                                className="block mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Montana's Premier
                            </motion.span>
                            <motion.span
                                className="block pb-2 gradient-text-animated"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Drywall Experts
                            </motion.span>
                        </motion.h1>

                        {/* Subheading with Service Types */}
                        <motion.div
                            className="mb-12"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                                {['ALL PHASE DRYWALL', 'RESIDENTIAL', 'COMMERCIAL'].map((item, i) => (
                                    <motion.span
                                        key={item}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
                                        style={{
                                            background: 'rgba(34, 211, 238, 0.1)',
                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                            color: 'rgba(34, 211, 238, 1)',
                                        }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Zap className="w-3 h-3" />
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Four generations of family craftsmanship serving Missoula and the surrounding valleys with
                                precision drywall installation, repair, and finishing services.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <motion.a
                                href="#contact"
                                className="group relative glass-button bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-5 px-10 rounded-2xl text-lg overflow-hidden"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                <span className="flex items-center justify-center gap-3 relative z-10">
                                    <Star className="w-6 h-6" />
                                    <span className="font-semibold">Get Your Free Quote</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.a>

                            <motion.a
                                href="tel:+14062390850"
                                className="group glass-button border border-white/20 hover:border-cyan-400/50 text-white font-medium py-5 px-10 rounded-2xl text-lg flex items-center justify-center"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="flex items-center justify-center gap-3 relative z-10">
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        <Phone className="w-6 h-6 text-cyan-400" />
                                    </motion.div>
                                    <span className="font-semibold">(406) 239-0850</span>
                                </span>
                            </motion.a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-4 mt-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            {[
                                { icon: <Award className="w-5 h-5" />, text: "Licensed & Insured" },
                                { icon: <Users className="w-5 h-5" />, text: "Family Team" },
                                { icon: <MapPin className="w-5 h-5" />, text: "Local Experts" },
                                { icon: <ShieldCheck className="w-5 h-5" />, text: "Satisfaction Guaranteed" }
                            ].map((badge, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                                >
                                    <span className="text-cyan-400">{badge.icon}</span>
                                    <span className="text-sm font-medium text-gray-200">{badge.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-6 mt-20 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        {[
                            { number: "49+", label: "Years Experience", icon: <Calendar className="w-6 h-6" /> },
                            { number: "1,200+", label: "Projects Completed", icon: <Hammer className="w-6 h-6" /> },
                            { number: "4", label: "Family Generations", icon: <Users className="w-6 h-6" /> }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="glass-card text-center p-6 rounded-2xl w-40 sm:w-48"
                                whileHover={{ y: -8, scale: 1.02 }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                            >
                                <div className="mb-4 flex justify-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                        {stat.icon}
                                    </div>
                                </div>
                                <motion.div
                                    className="text-3xl md:text-4xl font-bold gradient-text-animated mb-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </section>

            {/* Premium Services Section */}
            <section id="services" className="py-32 px-4 sm:px-6 lg:px-8 relative">
                {/* Section background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="premium-badge mx-auto mb-8"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Our Premium Services</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block mb-2">Complete Drywall</span>
                            <span className="block gradient-text-animated">
                                Solutions for Every Project
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            From initial consultation to final inspection, we provide comprehensive drywall solutions
                            with unmatched attention to detail and quality craftsmanship.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                className="group relative glass-card p-10 rounded-3xl overflow-hidden"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                                whileHover={{ y: -12, scale: 1.02 }}
                            >

                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl ${service.accent === 'cyan' ? 'bg-gradient-to-br from-cyan-500/5 to-transparent' :
                                    service.accent === 'blue' ? 'bg-gradient-to-br from-blue-500/5 to-transparent' :
                                        'bg-gradient-to-br from-amber-500/5 to-transparent'
                                    }`} />

                                {/* Icon with accent color */}
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${service.accent === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400' :
                                        service.accent === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400' :
                                            'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400'
                                        }`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {service.icon}
                                </motion.div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                                    {service.description}
                                </p>

                                {/* Animated progress bar */}
                                <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`absolute inset-y-0 left-0 rounded-full ${service.accent === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                                            service.accent === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                                                'bg-gradient-to-r from-amber-500 to-amber-400'
                                            }`}
                                        initial={{ width: '0%' }}
                                        whileInView={{ width: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.3 + index * 0.2 }}
                                    />
                                </div>

                                {/* Get a Quote button - Premium animated CTA */}
                                <motion.button
                                    onClick={() => {
                                        document.getElementById('contact')?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }}
                                    className="group/btn relative inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-semibold overflow-hidden cursor-pointer"
                                    whileHover={{ scale: 1.08, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300 }}
                                >
                                    {/* Gradient background */}
                                    <span className={`absolute inset-0 bg-gradient-to-r ${service.accent === 'cyan' ? 'from-cyan-500/20 to-blue-500/20' : service.accent === 'blue' ? 'from-blue-500/20 to-indigo-500/20' : 'from-amber-500/20 to-orange-500/20'}`} />

                                    {/* Border with glow */}
                                    <span className={`absolute inset-0 rounded-xl border ${service.accent === 'cyan' ? 'border-cyan-500/40 group-hover/btn:border-cyan-400/70 group-hover/btn:shadow-[0_0_20px_rgba(34,211,238,0.3)]' : service.accent === 'blue' ? 'border-blue-500/40 group-hover/btn:border-blue-400/70 group-hover/btn:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-amber-500/40 group-hover/btn:border-amber-400/70 group-hover/btn:shadow-[0_0_20px_rgba(245,158,11,0.3)]'} transition-all duration-500`} />

                                    {/* Shimmer effect on hover */}
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                                    />

                                    {/* Text content */}
                                    <span className={`relative z-10 flex items-center gap-2 ${service.accent === 'cyan' ? 'text-cyan-400 group-hover/btn:text-cyan-300' : service.accent === 'blue' ? 'text-blue-400 group-hover/btn:text-blue-300' : 'text-amber-400 group-hover/btn:text-amber-300'} transition-colors duration-300`}>
                                        <Star className="w-4 h-4" />
                                        <span>
                                            {service.title === "Complete Drywall Installation" ? "Start Installation" :
                                                service.title === "Repair & Restoration" ? "Assess Damage" :
                                                    "Customize Your Project"}
                                        </span>
                                        <motion.span
                                            className="inline-block"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </motion.span>
                                    </span>
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional services CTA */}
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-gray-400 mb-6">Need something specific? We handle custom projects too.</p>
                        <motion.a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-cyan-400/30 text-white hover:text-cyan-400 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">Discuss Your Project</span>
                        </motion.a>
                    </motion.div>
                </div>
            </section >

            {/* About Section - Alternating lighter background */}
            < section id="about" className="py-28 px-4 sm:px-6 lg:px-8 bg-white/[0.02]" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                className="inline-block px-6 py-2 mb-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full text-cyan-300 text-lg font-medium border border-cyan-500/20"
                                whileHover={{ scale: 1.05 }}
                            >
                                Since 1976
                            </motion.span>
                            <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-tight">
                                <span className="block mb-4">A Legacy of</span>
                                <motion.span
                                    className="block pb-2 bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                                    initial={{ backgroundPosition: "0% 50%" }}
                                    whileInView={{ backgroundPosition: "100% 50%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 3 }}
                                    style={{
                                        backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)',
                                        backgroundSize: '200% 200%',
                                    }}
                                >
                                    Excellence &amp; Integrity
                                </motion.span>
                            </h2>

                            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
                                Founded in 1976 by George Thompson, Creative Drywall has been a cornerstone of
                                Montana's construction community for nearly five decades. What began as a one-man
                                operation has grown into a family legacy, with George's three sons now leading
                                operations while preserving the core values that built the business.
                            </p>

                            <div className="space-y-6 mb-12">
                                <motion.div
                                    className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40 hover:border-cyan-500/30 transition-all duration-300"
                                    whileHover={{ x: 5 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">Generational Knowledge</h4>
                                        <p className="text-gray-300">Hands-on mentorship passed down through nearly five decades of family tradition.</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40 hover:border-cyan-500/30 transition-all duration-300"
                                    whileHover={{ x: 5 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">Quality Over Quantity</h4>
                                        <p className="text-gray-300">Every project receives personal attention from the Thompson family.</p>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                className="inline-flex items-center space-x-6"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex -space-x-4">
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 border-2 border-gray-900"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="font-bold text-cyan-300">The Thompson Family</p>
                                    <p className="text-gray-400 text-sm">4 Generations of Excellence</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="grid grid-cols-2 gap-6">
                                <motion.div
                                    className="glass-card p-8 rounded-3xl border border-gray-700/30"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Family Team</h3>
                                    <p className="text-cyan-400 text-3xl font-bold">4</p>
                                    <p className="text-gray-400 text-sm">Dedicated family members</p>
                                </motion.div>
                                <motion.div
                                    className="glass-card p-8 rounded-3xl border border-gray-700/30"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Local Experts</h3>
                                    <p className="text-cyan-400 text-3xl font-bold">30+</p>
                                    <p className="text-gray-400 text-sm">Montana communities served</p>
                                </motion.div>
                                <motion.div
                                    className="glass-card p-8 rounded-3xl border border-gray-700/30"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Experience</h3>
                                    <p className="text-cyan-400 text-3xl font-bold">49+</p>
                                    <p className="text-gray-400 text-sm">Years of expertise</p>
                                </motion.div>
                                <motion.div
                                    className="glass-card p-8 rounded-3xl border border-gray-700/30"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Guaranteed</h3>
                                    <p className="text-cyan-400 text-3xl font-bold">100%</p>
                                    <p className="text-gray-400 text-sm">Customer satisfaction</p>
                                </motion.div>
                            </div>

                            {/* Decorative element */}
                            <motion.div
                                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Premium Gallery Section */}
            < section id="gallery" className="py-32 px-4 sm:px-6 lg:px-8 relative" >
                {/* Background decoration */}
                < div className="absolute inset-0 overflow-hidden pointer-events-none" >
                    <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-amber-500/5 to-transparent rounded-full blur-3xl" />
                </div >

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="premium-badge mx-auto mb-8"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Image className="w-4 h-4" />
                            <span>Our Portfolio</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="block mb-2">Craftsmanship</span>
                            <span className="block gradient-text-animated">In Every Detail</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Explore a selection of our finest residential and commercial projects across Montana.
                        </p>
                    </motion.div>

                    {/* Gallery Grid with varied sizes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { url: "/portfolio-1.png", title: "Modern Interior", category: "Residential", size: "normal", accent: "cyan" },
                            { url: "/portfolio-2.png", title: "Commercial Complex", category: "Commercial", size: "tall", accent: "blue" },
                            { url: "/portfolio-3.png", title: "Luxury Renovation", category: "Remodel", size: "normal", accent: "amber" },
                            { url: "/portfolio-4.png", title: "Custom Texture", category: "Detailing", size: "normal", accent: "cyan" },
                            { url: "/portfolio-5.png", title: "Open Concept", category: "Residential", size: "tall", accent: "blue" },
                            { url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80", title: "High Ceilings", category: "Custom", size: "normal", accent: "amber" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className={`group relative overflow-hidden rounded-3xl ${item.size === 'tall' ? 'md:row-span-2 h-[500px]' : 'h-80'
                                    } cursor-pointer`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                {/* Image */}
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                />

                                {/* Gradient overlay - always visible at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Hover overlay with glow */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.accent === 'cyan' ? 'bg-gradient-to-t from-cyan-900/50 to-transparent' :
                                    item.accent === 'blue' ? 'bg-gradient-to-t from-blue-900/50 to-transparent' :
                                        'bg-gradient-to-t from-amber-900/50 to-transparent'
                                    }`} />

                                {/* Category badge */}
                                <div className="absolute top-4 left-4">
                                    <motion.span
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${item.accent === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' :
                                            item.accent === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                                                'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                            }`}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        {item.category}
                                    </motion.span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <motion.h3
                                        className="text-2xl font-bold text-white mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300"
                                    >
                                        {item.title}
                                    </motion.h3>
                                    <motion.div
                                        className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <span className="text-gray-300 text-sm">View Project</span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </motion.div>
                                </div>

                                {/* Border glow on hover */}
                                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.accent === 'cyan' ? 'ring-2 ring-cyan-400/50' :
                                    item.accent === 'blue' ? 'ring-2 ring-blue-400/50' :
                                        'ring-2 ring-amber-400/50'
                                    }`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* View all projects CTA */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 text-white hover:text-cyan-400 transition-all font-medium"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>Let's Create Your Project</span>
                            <ChevronRight className="w-5 h-5" />
                        </motion.a>
                    </motion.div>
                </div>
            </section >

            {/* Quote Calculator Section */}
            < QuoteCalculator />

            {/* Contact & Consultation Section */}
            < section id="contact" className="py-28 px-4 sm:px-6 lg:px-8" >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="premium-badge mx-auto mb-8"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Get In Touch</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block mb-2">Contact Creative</span>
                            <span className="block gradient-text-animated">Drywall Today</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Reach out to the Thompson family for a free consultation and detailed quote for your
                            residential or commercial drywall project.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            className="glass-card p-10 rounded-3xl border border-gray-700/30"
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="mb-10">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Request a Quote</h3>
                                <p className="text-gray-400 text-lg">Fill out the form below and we'll contact you within 24 hours</p>
                            </div>

                            {submitSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <motion.div
                                        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: 3,
                                            repeatDelay: 0.2
                                        }}
                                    >
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </motion.div>
                                    <motion.h4
                                        className="text-3xl font-bold mb-6 text-green-400"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Consultation Requested!
                                    </motion.h4>
                                    <motion.p
                                        className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Thank you for your inquiry! George and the Thompson family will contact you within 24 hours
                                        to confirm your consultation details.
                                    </motion.p>
                                    <motion.div
                                        className="bg-gray-800/40 rounded-2xl p-6 text-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <p className="font-bold text-cyan-300 mb-4">Next Steps:</p>
                                        <ul className="text-gray-300 space-y-3">
                                            <motion.li
                                                className="flex items-start space-x-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Phone call to confirm consultation details</span>
                                            </motion.li>
                                            <motion.li
                                                className="flex items-start space-x-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.9 }}
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Email with project preparation checklist</span>
                                            </motion.li>
                                            <motion.li
                                                className="flex items-start space-x-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.0 }}
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>Scheduled on-site consultation with family expert</span>
                                            </motion.li>
                                        </ul>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {submitError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-red-400 mb-6"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-lg font-medium">{submitError}</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-3">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
                                                    placeholder="John Smith"
                                                />
                                                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-3">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
                                                    placeholder="john@email.com"
                                                />
                                                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label htmlFor="phone" className="block text-lg font-medium text-gray-300 mb-3">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
                                                    placeholder="(406) 239-0850"
                                                />
                                                <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label htmlFor="projectType" className="block text-lg font-medium text-gray-300 mb-3">
                                                Project Type *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="projectType"
                                                    name="projectType"
                                                    value={formData.projectType}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg appearance-none"
                                                >
                                                    <option value="residential">Residential</option>
                                                    <option value="commercial">Commercial</option>
                                                    <option value="remodel">Remodel/Renovation</option>
                                                </select>
                                                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label htmlFor="propertyType" className="block text-lg font-medium text-gray-300 mb-3">
                                                Property Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="propertyType"
                                                    name="propertyType"
                                                    value={formData.propertyType}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg appearance-none"
                                                >
                                                    <option value="new-construction">New Construction</option>
                                                    <option value="existing-home">Existing Home</option>
                                                    <option value="historic">Historic Property</option>
                                                    <option value="commercial-building">Commercial Building</option>
                                                </select>
                                                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <label htmlFor="timeline" className="block text-lg font-medium text-gray-300 mb-3">
                                                Project Timeline
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="timeline"
                                                    name="timeline"
                                                    value={formData.timeline}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg appearance-none"
                                                >
                                                    <option value="asap">As Soon As Possible</option>
                                                    <option value="1-2-weeks">1-2 Weeks</option>
                                                    <option value="2-4-weeks">2-4 Weeks</option>
                                                    <option value="1-2-months">1-2 Months</option>
                                                </select>
                                                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <label htmlFor="message" className="block text-lg font-medium text-gray-300 mb-3">
                                            Project Details
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg resize-none"
                                            placeholder="Tell us about your project, square footage, special requirements, or any other details..."
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="glass-button w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 px-8 rounded-2xl text-xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!isSubmitting ? { scale: 1.02, y: -3 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center space-x-4">
                                                    <motion.div
                                                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <span>Processing Your Request...</span>
                                                </div>
                                            ) : (
                                                <span className="flex items-center justify-center space-x-3">
                                                    <Mail className="w-6 h-6" />
                                                    <span>Request Consultation & Quote</span>
                                                </span>
                                            )}
                                        </motion.button>
                                        <p className="text-gray-500 text-center mt-4">
                                            By submitting, you agree to our privacy policy. We'll contact you within 24 hours.
                                        </p>
                                    </motion.div>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            className="glass-card p-10 rounded-3xl border border-gray-700/30"
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="mb-10">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Contact Information</h3>
                                <p className="text-gray-400 text-lg mb-6">
                                    Reach out to the Thompson family directly or visit our office at <a href="https://www.google.com/maps/search/?api=1&query=6785+Prairie+Schooner+Lane+Missoula+MT+59808" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-cyan-400/30 underline-offset-4">6785 Prairie Schooner Lane, Missoula, MT 59808</a>.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-white">Phone</h4>
                                            <p className="text-2xl font-bold text-cyan-400">(406) 239-0850</p>
                                            <p className="text-gray-400">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40">
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-white">Email</h4>
                                            <p className="text-2xl font-bold text-cyan-400 break-all">info@creativedrywall.buzz</p>
                                            <p className="text-gray-400">Response within 24 hours</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=6785+Prairie+Schooner+Lane+Missoula+MT+59808"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40 hover:border-cyan-500/50 transition-all group"
                                    >
                                        <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                                            <MapPin className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-white">Location</h4>
                                            <p className="text-2xl font-bold text-gray-300 group-hover:text-cyan-300 transition-colors">6785 Prairie Schooner Lane</p>
                                            <p className="text-gray-400">Missoula, MT 59808</p>
                                        </div>
                                    </a>
                                </motion.div>

                                <motion.div
                                    className="bg-gray-800/30 rounded-2xl p-8"
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white">Why Choose Us?</h4>
                                    </div>
                                    <div className="space-y-5 text-lg text-gray-300">
                                        <motion.div
                                            className="flex items-start space-x-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <span>Family-owned business with 49+ years of experience</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-start space-x-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.0 }}
                                        >
                                            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <Star className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <span>100% satisfaction guarantee on all projects</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-start space-x-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.1 }}
                                        >
                                            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <Hammer className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <span>All phase drywall service for residential & commercial</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Service Area Section - Missoula Drywall Contractor */}
            < section id="service-area-missoula" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-gray-900/20" >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="premium-badge mx-auto mb-8"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <MapPin className="w-4 h-4" />
                            <span>Service Area</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block mb-2">Missoula's Premier</span>
                            <span className="block gradient-text-animated">Drywall Contractor</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Creative Drywall proudly serves Missoula, Montana and surrounding communities with professional
                            drywall installation, repair, and texturing services. From residential homes to commercial buildings,
                            we're your trusted local drywall contractor.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Google Maps Embed */}
                        <motion.div
                            className="glass-card rounded-3xl overflow-hidden border border-gray-700/30"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="p-6 border-b border-gray-700/30">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-cyan-400" />
                                    <span>Our Service Area</span>
                                </h3>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d172837.29878088098!2d-114.16835566406248!3d46.87218620000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x535dcc2a50f367cb%3A0xe9e31277ca94802e!2sMissoula%2C%20MT!5e0!3m2!1sen!2sus!4v1704419280000!5m2!1sen!2sus"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Creative Drywall Missoula Service Area Map"
                                className="w-full"
                            />
                        </motion.div>

                        {/* Cities We Serve */}
                        <motion.div
                            className="glass-card p-8 rounded-3xl border border-gray-700/30"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-cyan-400" />
                                <span>Cities We Serve</span>
                            </h3>
                            <p className="text-gray-400 mb-8">
                                As Missoula's leading drywall contractor, we provide expert drywall services throughout
                                Western Montana. Our skilled team travels to serve residential and commercial clients
                                in the following areas:
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { city: 'Missoula', highlight: true },
                                    { city: 'Lolo', highlight: false },
                                    { city: 'Florence', highlight: false },
                                    { city: 'Stevensville', highlight: false },
                                    { city: 'Hamilton', highlight: false },
                                    { city: 'Frenchtown', highlight: false },
                                    { city: 'Bonner', highlight: false },
                                    { city: 'East Missoula', highlight: false }
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.city}
                                        className={`flex items-center gap-3 p-4 rounded-xl ${item.highlight
                                            ? 'bg-cyan-500/20 border border-cyan-500/30'
                                            : 'bg-gray-800/40 border border-gray-700/30'
                                            }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CheckCircle className={`w-5 h-5 ${item.highlight ? 'text-cyan-400' : 'text-gray-500'}`} />
                                        <span className={item.highlight ? 'font-bold text-cyan-300' : 'text-gray-300'}>
                                            {item.city}, MT
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
                                <h4 className="font-bold text-lg mb-3 text-cyan-300">Drywall Services in Missoula Include:</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        <span>New construction drywall installation</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        <span>Drywall repair and patching</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        <span>Texture matching and application</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        <span>Water damage restoration</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        <span>Commercial drywall projects</span>
                                    </li>
                                </ul>
                            </div>

                            <motion.a
                                href="#contact"
                                className="glass-button w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Phone className="w-5 h-5" />
                                <span>Get a Free Missoula Estimate</span>
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* CTA Section - Subtle alternation */}
            < section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/40 to-gray-800/30 backdrop-blur-sm" >
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h2
                            className="text-4xl md:text-6xl font-bold mb-10"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Ready for <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Professional Results</span>?
                        </motion.h2>
                        <motion.p
                            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            Call or email the Thompson family today for a free consultation and detailed quote
                            for your drywall project.
                        </motion.p>

                        <motion.div
                            className="glass-card p-12 md:p-16 rounded-3xl border border-gray-700/40 max-w-3xl mx-auto"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-6 border border-cyan-500/30">
                                    <Phone className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Contact Creative Drywall</h3>
                                <p className="text-gray-400 text-xl">Family-owned since 1976</p>
                            </div>

                            <div className="space-y-6 mb-10">
                                <motion.div
                                    className="flex items-center justify-center space-x-4 text-gray-300 text-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <Phone className="w-6 h-6 text-cyan-400" />
                                    <a href="tel:+14062390850" className="font-bold hover:text-cyan-300 transition-colors">(406) 239-0850</a>
                                </motion.div>
                                <motion.div
                                    className="flex items-center justify-center space-x-4 text-gray-300 text-xl"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <Mail className="w-6 h-6 text-cyan-400" />
                                    <a href="mailto:info@creativedrywall.buzz" className="font-bold hover:text-cyan-300 transition-colors break-all">info@creativedrywall.buzz</a>
                                </motion.div>
                            </div>



                            <motion.p
                                className="text-gray-400 text-lg mt-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.0 }}
                            >
                                Serving Missoula, Bozeman, Kalispell, and all surrounding Montana valleys
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>
            </section >

            {/* Footer */}
            < footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-4 mb-8">
                                {/* Updated Company Logo in Footer */}
                                <motion.div
                                    className="flex items-center justify-center px-3 py-2 rounded-2xl bg-white border border-white/10 backdrop-blur-md shadow-lg shadow-cyan-500/10"
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src="/logo.png"
                                        alt="Creative Drywall Logo"
                                        className="h-14 w-auto object-contain"
                                    />
                                </motion.div>
                                <div className="flex flex-col items-start">
                                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                                        CREATIVE DRYWALL
                                    </span>
                                    <span className="text-sm text-cyan-400/80 tracking-wider">SINCE 1976</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-8 text-lg max-w-2xl">
                                Montana's premier family-owned drywall company, serving the Treasure State
                                with pride, integrity, and unmatched craftsmanship since 1976.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 text-lg">
                                    <Phone className="w-6 h-6 text-cyan-400" />
                                    <span className="font-medium">(406) 239-0850</span>
                                </div>
                                <div className="flex items-center space-x-4 text-lg">
                                    <Mail className="w-6 h-6 text-cyan-400" />
                                    <span className="font-medium break-all">info@creativedrywall.buzz</span>
                                </div>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=6785+Prairie+Schooner+Lane+Missoula+MT+59808"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-4 text-lg hover:text-cyan-300 transition-colors group"
                                >
                                    <MapPin className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">6785 Prairie Schooner Lane, Missoula, MT 59808</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-8 text-white">Services</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <Hammer className="w-4 h-4" />
                                        <span>Complete Installation</span>
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Repair & Restoration</span>
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <Users className="w-4 h-4" />
                                        <span>All Phase Service</span>
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        <span>Commercial Projects</span>
                                    </motion.a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-8 text-white">Company</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <Home className="w-4 h-4" />
                                        <span>Home</span>
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>About Us</span>
                                    </motion.a>
                                </li>

                                <li>
                                    <motion.a
                                        href="#contact"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contact</span>
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/50 mt-16 pt-10 text-center">
                        <motion.p
                            className="text-gray-500 text-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            &copy; 2025 Creative Drywall. Family Owned & Operated Since 1976. All rights reserved.
                        </motion.p>
                        <motion.p
                            className="mt-4 text-gray-600 text-lg font-medium"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            ALL PHASE DRYWALL SERVICE • RESIDENTIAL AND COMMERCIAL
                        </motion.p>
                        <motion.p
                            className="mt-4 text-xs font-medium text-gray-600/70 tracking-widest uppercase"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >

                            Powered by <a href="https://techguruofficial.us" target="_blank" rel="noopener noreferrer" className="text-cyan-500/70 font-bold hover:text-cyan-400 transition-colors">TECHGURU</a>
                        </motion.p>
                    </div>
                </div>
            </footer >

            {/* Floating Back to Top Button */}
            < AnimatePresence >
                {scrollY > 500 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-5 left-5 z-50 w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800/95 to-slate-900/98 backdrop-blur-xl border border-white/10 text-cyan-400 flex items-center justify-center transition-all duration-300 hover:border-cyan-500/30"
                        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Back to top"
                    >
                        <ArrowDown className="w-6 h-6 rotate-180" />
                    </motion.button>
                )}
            </AnimatePresence >
        </div >
    );
};

export default App;
