import { useState, useEffect } from 'react';
import { Phone, MapPin, ShieldCheck, Hammer, Users, Star, Calendar, CheckCircle, Clock, Mail, Menu, X, Home, Briefcase, User, Image, MessageCircle, Sun, Moon, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuoteCalculator from './components/QuoteCalculator';

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

    // Hero video URL (royalty-free construction video)
    const heroVideoUrl = "https://videos.pexels.com/video-files/5477712/5477712-uhd_2560_1440_30fps.mp4";
    const heroFallbackImage = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80";

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
            const sections = ['home', 'services', 'about', 'gallery', 'contact'];
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
            description: "Full-service drywall installation from framing to final finish for residential and commercial properties."
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Repair & Restoration",
            description: "Expert repair of damaged drywall, water damage, and structural issues with lasting solutions."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "All Phase Service",
            description: "Comprehensive drywall services including hanging, taping, texturing, and finishing for any project size."
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
        { id: 'gallery', label: 'Gallery', icon: Image },
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
                        <div className="hidden md:flex items-center space-x-2">
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
                                <div className="px-4 py-4 space-y-2">
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
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Hero Section with Rotating Images */}
            <section id="home" className="pt-40 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Hero Background with Video */}
                <div className="absolute inset-0">
                    {/* Video Background */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={heroFallbackImage}
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={heroVideoUrl} type="video/mp4" />
                    </video>
                    {/* Overlay */}
                    <div className="absolute inset-0 hero-overlay"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="inline-block"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <motion.span
                                className="inline-flex items-center px-8 py-3 mb-8 rounded-full text-white/90 text-lg font-medium tracking-wide backdrop-blur-2xl"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
                                }}
                            >
                                Family Owned & Operated Since 1976
                            </motion.span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="block mb-4">Montana's Premier</span>
                            <motion.span
                                className="block pb-2 bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)',
                                    backgroundSize: '200% 200%',
                                }}
                            >
                                Drywall Experts
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <span className="text-cyan-300 font-bold text-2xl block mb-4">ALL PHASE DRYWALL SERVICE • RESIDENTIAL & COMMERCIAL</span>
                            Four generations of family craftsmanship serving Missoula and the surrounding valleys with
                            precision drywall installation, repair, and finishing services.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <motion.a
                                href="#contact"
                                className="glass-button bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform relative overflow-hidden"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/30 to-cyan-600/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="flex items-center justify-center space-x-3 relative z-10">
                                    <Star className="w-6 h-6" />
                                    <span className="font-semibold">Get Your Free Quote</span>
                                </span>
                            </motion.a>

                            <motion.a
                                href="tel:+14062390850"
                                className="glass-button border border-gray-600/50 hover:border-cyan-500/50 text-gray-200 hover:text-cyan-300 font-medium py-5 px-10 rounded-2xl text-lg transition-all duration-300 relative overflow-hidden flex items-center justify-center"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 bg-gray-800/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="flex items-center justify-center space-x-3 relative z-10">
                                    <Phone className="w-6 h-6" />
                                    <span className="font-semibold">(406) 239-0850</span>
                                </span>
                            </motion.a>
                        </motion.div>

                        {/* Floating Badges */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-4 mt-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            {[
                                { icon: <Users className="w-5 h-5" />, text: "Family Team" },
                                { icon: <MapPin className="w-5 h-5" />, text: "Local Experts" },
                                { icon: <ShieldCheck className="w-5 h-5" />, text: "Guaranteed" },
                                { icon: <Clock className="w-5 h-5" />, text: "49+ Years" }
                            ].map((badge, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800/40 backdrop-blur-sm rounded-full border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
                                    whileHover={{ y: -3, borderColor: 'rgba(59, 130, 246, 0.5)' }}
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

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        {[
                            { number: "49+", label: "Years Experience", icon: <Calendar className="w-6 h-6" /> },
                            { number: "1,200+", label: "Projects Completed", icon: <Hammer className="w-6 h-6" /> },
                            { number: "4", label: "Family Generations", icon: <Users className="w-6 h-6" /> },
                            { number: "100%", label: "Customer Satisfaction", icon: <Star className="w-6 h-6" /> }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/40 hover:border-cyan-500/30 transition-all duration-300"
                                whileHover={{ y: -5, scale: 1.02 }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                            >
                                <div className="mb-4 flex justify-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            className="inline-block px-6 py-2 mb-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-full text-cyan-300 text-lg font-medium border border-cyan-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            Our Premium Services
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block">Complete Drywall</span>
                            <motion.span
                                className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent"
                                initial={{ backgroundPosition: "0% 50%" }}
                                whileInView={{ backgroundPosition: "100% 50%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)',
                                    backgroundSize: '200% 200%',
                                }}
                            >
                                Solutions for Every Project
                            </motion.span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                            From initial consultation to final inspection, we provide comprehensive drywall solutions
                            with unmatched attention to detail and quality craftsmanship passed down through generations.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                className="glass-card p-10 rounded-3xl border border-gray-700/30 hover:border-cyan-500/40 transition-all duration-500"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-6 text-white">{service.title}</h3>
                                <p className="text-gray-300 mb-8 leading-relaxed text-lg">{service.description}</p>
                                <motion.div
                                    className="w-full h-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full overflow-hidden"
                                    whileHover={{ width: '100%' }}
                                >
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                        initial={{ width: '0%' }}
                                        whileInView={{ width: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.span
                                className="inline-block px-6 py-2 mb-8 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-full text-cyan-300 text-lg font-medium border border-cyan-500/30"
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
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            className="inline-block px-6 py-2 mb-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-full text-cyan-300 text-lg font-medium border border-cyan-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            Our Portfolio
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block">Craftsmanship</span>
                            <motion.span
                                className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent"
                                initial={{ backgroundPosition: "0% 50%" }}
                                whileInView={{ backgroundPosition: "100% 50%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)',
                                    backgroundSize: '200% 200%',
                                }}
                            >
                                In Every Detail
                            </motion.span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                            Explore a selection of our finest residential and commercial projects across Montana.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { url: "/portfolio-1.png", title: "Modern Interior", category: "Residential" },
                            { url: "/portfolio-2.png", title: "Commercial Complex", category: "Commercial" },
                            { url: "/portfolio-3.png", title: "Luxury Renovation", category: "Remodel" },
                            { url: "/portfolio-4.png", title: "Custom Texture", category: "Detailing" },
                            { url: "/portfolio-5.png", title: "Open Concept", category: "Residential" },
                            { url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80", title: "High Ceilings", category: "Custom" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-3xl h-80 glass-card border border-gray-700/30"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <span className="text-cyan-400 font-medium mb-2">{item.category}</span>
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Calculator Section */}
            <QuoteCalculator />

            {/* Contact & Consultation Section */}
            <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            className="inline-block px-6 py-2 mb-8 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-full text-cyan-300 text-lg font-medium border border-cyan-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            Get In Touch
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="block">Contact Creative</span>
                            <motion.span
                                className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent"
                                initial={{ backgroundPosition: "0% 50%" }}
                                whileInView={{ backgroundPosition: "100% 50%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 3 }}
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee, #60a5fa)',
                                    backgroundSize: '200% 200%',
                                }}
                            >
                                Drywall Today
                            </motion.span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
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
                                    Reach out to the Thompson family directly or visit our office in Missoula, Montana.
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
                                    <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/40">
                                        <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-white">Location</h4>
                                            <p className="text-2xl font-bold text-gray-300">Missoula, Montana</p>
                                            <p className="text-gray-400">Serving all surrounding valleys</p>
                                        </div>
                                    </div>
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
            </section>

            {/* CTA Section */}
            <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/70 to-gray-800/50">
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

                            <motion.a
                                href="#contact"
                                className="glass-button w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all duration-300 transform"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center justify-center space-x-4">
                                    <Star className="w-6 h-6" />
                                    <span>Request Free Consultation</span>
                                </span>
                            </motion.a>

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
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-4 mb-8">
                                {/* Updated Company Logo in Footer */}
                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-cyan-500/10"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <img
                                        src="/favicon.ico"
                                        alt="Creative Drywall Logo"
                                        className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
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
                                <div className="flex items-center space-x-4 text-lg">
                                    <MapPin className="w-6 h-6 text-cyan-400" />
                                    <span className="font-medium">Missoula, Montana</span>
                                </div>
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
                                        href="#"
                                        className="hover:text-cyan-300 transition-colors duration-300 text-lg flex items-center space-x-2"
                                        whileHover={{ x: 5 }}
                                    >
                                        <Image className="w-4 h-4" />
                                        <span>Gallery</span>
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
                            Powered by <span className="text-cyan-500/70 font-bold">TECHGURU</span>
                        </motion.p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
