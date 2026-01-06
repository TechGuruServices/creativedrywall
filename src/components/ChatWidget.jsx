import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Copy, Check, Trash2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ChatWidget - Premium AI chat assistant for Creative Drywall
 * Features: Quick replies, markdown, timestamps, copy, clear, sound, animations, keyboard shortcuts, character counter
 */

const MAX_MESSAGE_LENGTH = 500;

// Quick reply suggestions
const QUICK_REPLIES = [
    { label: "Get a Quote", message: "I'd like to get a quote for drywall services." },
    { label: "Service Areas", message: "What areas do you serve?" },
    { label: "Pricing Info", message: "Can you tell me about your pricing?" },
    { label: "Contact Info", message: "How can I contact Creative Drywall directly?" }
];

// Simple markdown parser for bold, italics, links, and lists
function parseMarkdown(text) {
    if (!text) return '';

    // Escape HTML first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br/>');

    // Bullet points: - item or * item
    html = html.replace(/^[-*]\s+(.+)$/gm, '<span class="chat-bullet">• $1</span>');

    return html;
}

// Format timestamp
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm the Creative Drywall assistant. How can I help you today? Ask me about our services, pricing, or anything else!",
            timestamp: new Date(),
            isWelcome: true
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const notificationSound = useRef(null);

    // Initialize notification sound
    useEffect(() => {
        // Create a subtle notification sound using Web Audio API
        notificationSound.current = {
            play: () => {
                if (!soundEnabled) return;
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 800;
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                } catch (e) {
                    // Audio not supported, silent fail
                }
            }
        };
    }, [soundEnabled]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens & show welcome animation
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            // Trigger welcome message animation
            setTimeout(() => setShowWelcome(true), 300);
        } else {
            setShowWelcome(false);
        }
    }, [isOpen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
            // Ctrl/Cmd + Shift + C to toggle chat
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Copy message to clipboard
    const copyMessage = useCallback(async (content, id) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    // Clear chat
    const clearChat = useCallback(() => {
        if (window.confirm('Clear all messages?')) {
            setMessages([{
                role: 'assistant',
                content: "Chat cleared! How can I help you?",
                timestamp: new Date()
            }]);
        }
    }, []);

    // Auto-reply content map
    const AUTO_RESPONSES = {
        "I'd like to get a quote for drywall services.": "Excellent choice! To provide an accurate quote, we'd love to know more about your project. You can use our Quote Calculator above, or call us directly at **(406) 239-0850**.",
        "What areas do you serve?": "We proudly serve the entire **Missoula Valley** and surrounding areas, including Lolo, Florence, Stevensville, Victor, Corvallis, Hamilton, and Frenchtown. If you're in Western Montana, we've got you covered!",
        "Can you tell me about your pricing?": "Our pricing is tailored to your specific project needs (square footage, finish level, etc.) to ensure the best value. We offer premium craftsmanship at competitive rates. Call us at **(406) 239-0850** for a free estimate!",
        "How can I contact Creative Drywall directly?": "We're here to help! You can reach us directly at **(406) 239-0850**. Alternatively, feel free to fill out the contact form below, and we'll get back to you within 24 hours."
    };

    // Handle quick reply click
    const handleQuickReply = useCallback((message) => {
        // Add user message immediately
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Check for auto-response
        const autoResponse = AUTO_RESPONSES[message];

        if (autoResponse) {
            setIsLoading(true);
            // Simulate natural typing delay (800ms)
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: autoResponse,
                    timestamp: new Date()
                }]);
                setIsLoading(false);
                notificationSound.current?.play();
            }, 800);
        } else {
            // Fallback to normal send if no auto-response match (shouldn't happen with current config)
            setInput(message);
            inputRef.current?.focus();
        }
    }, []);

    const sendMessage = async (messageText = input) => {
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage || isLoading) return;

        setInput('');

        // Add user message with timestamp
        const userMessage = {
            role: 'user',
            content: trimmedMessage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Build history for context (last 10 messages)
            const history = messages.slice(-10).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmedMessage, history })
            });

            // Handle non-OK responses (502, 503, etc.)
            if (!response.ok) {
                let errorMessage = "I'm temporarily unavailable. Please try again later or use the contact form.";
                if (response.status === 502 || response.status === 503) {
                    errorMessage = "Our chat service is being configured. Please use the contact form or call us at (406) 239-0850.";
                }
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: errorMessage,
                    timestamp: new Date()
                }]);
                return;
            }

            // Try to parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I received an invalid response. Please try again or contact us directly.",
                    timestamp: new Date()
                }]);
                return;
            }

            if (data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message,
                    timestamp: new Date()
                }]);
                // Play notification sound
                notificationSound.current?.play();
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message || "Sorry, I'm having trouble responding. Please try again.",
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting. Please try again or use the contact form.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_MESSAGE_LENGTH) {
            setInput(value);
        }
    };

    const characterCount = input.length;
    const isNearLimit = characterCount > MAX_MESSAGE_LENGTH * 0.8;
    const isAtLimit = characterCount >= MAX_MESSAGE_LENGTH;

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="chat-fab"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Close chat" : "Open chat (Ctrl+Shift+C)"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        role="dialog"
                        aria-label="Chat with Creative Drywall Assistant"
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <Bot size={20} />
                                <span>Creative Drywall Assistant</span>
                            </div>
                            <div className="chat-header-actions">
                                {/* Sound Toggle */}
                                <motion.button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="chat-header-btn"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
                                    title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                                >
                                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                </motion.button>
                                {/* Clear Chat */}
                                <motion.button
                                    onClick={clearChat}
                                    className="chat-header-btn"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Clear chat"
                                    title="Clear chat"
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                                {/* Status */}
                                <div className="chat-status">
                                    <span className="chat-status-dot"></span>
                                    Online
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`chat-message ${msg.role}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: msg.isWelcome && !showWelcome ? 0 : 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: msg.isWelcome ? 0.5 : 0
                                    }}
                                >
                                    <div className="chat-message-icon">
                                        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className="chat-message-wrapper">
                                        <div
                                            className="chat-message-content"
                                            dangerouslySetInnerHTML={
                                                msg.role === 'assistant'
                                                    ? { __html: parseMarkdown(msg.content) }
                                                    : undefined
                                            }
                                        >
                                            {msg.role === 'user' ? msg.content : null}
                                        </div>
                                        <div className="chat-message-meta">
                                            {msg.timestamp && (
                                                <span className="chat-timestamp">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            )}
                                            {msg.role === 'assistant' && (
                                                <motion.button
                                                    className="chat-copy-btn"
                                                    onClick={() => copyMessage(msg.content, idx)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    aria-label="Copy message"
                                                    title="Copy message"
                                                >
                                                    {copiedId === idx ? (
                                                        <Check size={12} className="text-green-400" />
                                                    ) : (
                                                        <Copy size={12} />
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator with animated dots */}
                            {isLoading && (
                                <motion.div
                                    className="chat-message assistant"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="chat-message-icon">
                                        <Bot size={16} />
                                    </div>
                                    <div className="chat-message-content chat-typing">
                                        <div className="typing-dots">
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                            />
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                                            />
                                            <motion.span
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {messages.length <= 2 && !isLoading && (
                            <motion.div
                                className="chat-quick-replies"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {QUICK_REPLIES.map((reply, idx) => (
                                    <motion.button
                                        key={idx}
                                        className="chat-quick-reply-btn"
                                        onClick={() => handleQuickReply(reply.message)}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {reply.label}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {/* Input */}
                        <div className="chat-input-container">
                            <div className="chat-input-wrapper">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about our services..."
                                    className="chat-input"
                                    disabled={isLoading}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    aria-label="Type your message"
                                />
                                {/* Character Counter */}
                                <span className={`chat-char-counter ${isNearLimit ? 'warning' : ''} ${isAtLimit ? 'limit' : ''}`}>
                                    {characterCount}/{MAX_MESSAGE_LENGTH}
                                </span>
                            </div>
                            <motion.button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading}
                                className="chat-send-btn"
                                aria-label="Send message"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Send size={18} />
                            </motion.button>
                        </div>

                        {/* Keyboard hint */}
                        <div className="chat-keyboard-hint">
                            Press <kbd>Esc</kbd> to close
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
