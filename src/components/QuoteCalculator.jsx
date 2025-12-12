import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, Hammer, Sparkles, DollarSign } from 'lucide-react';

const QuoteCalculator = () => {
    const [dimensions, setDimensions] = useState({
        length: '',
        width: '',
        height: '8',
    });
    const [projectType, setProjectType] = useState('new-construction');
    const [complexity, setComplexity] = useState('standard');
    const [estimate, setEstimate] = useState(null);

    // Base rates per square foot
    const baseRates = {
        'new-construction': 1.50,
        'repair': 2.00,
        'texture': 1.25,
        'finishing': 1.75,
    };

    // Complexity multipliers
    const complexityMultipliers = {
        'basic': 1.0,
        'standard': 1.3,
        'premium': 1.8,
    };

    const calculateEstimate = () => {
        const { length, width, height } = dimensions;
        if (!length || !width || !height) return;

        // Calculate wall and ceiling area
        const ceilingArea = parseFloat(length) * parseFloat(width);
        const wallArea = 2 * (parseFloat(length) + parseFloat(width)) * parseFloat(height);
        const totalArea = ceilingArea + wallArea;

        // Calculate estimate
        const baseRate = baseRates[projectType];
        const multiplier = complexityMultipliers[complexity];
        const estimatedCost = totalArea * baseRate * multiplier;

        setEstimate({
            area: Math.round(totalArea),
            low: Math.round(estimatedCost * 0.85),
            high: Math.round(estimatedCost * 1.15),
            mid: Math.round(estimatedCost),
        });
    };

    const projectTypes = [
        { id: 'new-construction', label: 'New Construction', icon: Home },
        { id: 'repair', label: 'Repair & Patch', icon: Hammer },
        { id: 'texture', label: 'Texturing', icon: Sparkles },
        { id: 'finishing', label: 'Finishing Only', icon: DollarSign },
    ];

    const complexityLevels = [
        { id: 'basic', label: 'Basic', description: 'Simple rooms, minimal complexity' },
        { id: 'standard', label: 'Standard', description: 'Average residential project' },
        { id: 'premium', label: 'Premium', description: 'High ceilings, custom details' },
    ];

    return (
        <section id="quote-calculator" className="py-24 px-4 sm:px-6 lg:px-8" role="region" aria-label="Quote Calculator">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-cyan-300 text-sm font-medium backdrop-blur-xl bg-white/5 border border-white/10 mb-6">
                        <Calculator className="w-4 h-4" />
                        Instant Estimate
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Get Your <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Free Quote</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Enter your room dimensions for an instant ballpark estimate. Final pricing provided after consultation.
                    </p>
                </motion.div>

                <motion.div
                    className="glass-card rounded-3xl p-8 md:p-10"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Room Dimensions */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                            <Home className="w-5 h-5 text-cyan-400" />
                            Room Dimensions (feet)
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="length" className="block text-sm text-gray-400 mb-2">Length</label>
                                <input
                                    type="number"
                                    id="length"
                                    aria-label="Room length in feet"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="12"
                                    value={dimensions.length}
                                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="width" className="block text-sm text-gray-400 mb-2">Width</label>
                                <input
                                    type="number"
                                    id="width"
                                    aria-label="Room width in feet"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="10"
                                    value={dimensions.width}
                                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-sm text-gray-400 mb-2">Height</label>
                                <input
                                    type="number"
                                    id="height"
                                    aria-label="Room height in feet"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="8"
                                    value={dimensions.height}
                                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Type */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                            <Hammer className="w-5 h-5 text-cyan-400" />
                            Project Type
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {projectTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        aria-pressed={projectType === type.id}
                                        onClick={() => setProjectType(type.id)}
                                        className={`p-4 rounded-xl border transition-all duration-300 text-left ${projectType === type.id
                                            ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mb-2" />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Complexity */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            Complexity Level
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {complexityLevels.map((level) => (
                                <button
                                    key={level.id}
                                    type="button"
                                    aria-pressed={complexity === level.id}
                                    onClick={() => setComplexity(level.id)}
                                    className={`p-4 rounded-xl border transition-all duration-300 text-left ${complexity === level.id
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="text-base font-semibold block mb-1">{level.label}</span>
                                    <span className="text-xs opacity-70">{level.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <motion.button
                        type="button"
                        onClick={calculateEstimate}
                        className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="Calculate estimate"
                    >
                        Calculate Estimate
                    </motion.button>

                    {/* Results */}
                    {estimate && (
                        <motion.div
                            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-center">
                                <p className="text-gray-400 mb-2">Estimated Range for {estimate.area} sq ft</p>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                                    ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500">
                                    *Estimate only. Final quote after free consultation.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default QuoteCalculator;
