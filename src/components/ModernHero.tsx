
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Phone, Users, TrendingUp, Target, BarChart3, Zap, ArrowDown, ArrowUp } from 'lucide-react';

const ModernHero = () => {
    const statsData = [
        { label: "Calls Per Hour", value: "10K+", icon: Phone, color: "text-orange-600" },
        { label: "Success Rate", value: "85%", icon: TrendingUp, color: "text-gray-700" },
        { label: "Response Time", value: "<2s", icon: Zap, color: "text-orange-500" },
        { label: "Active Users", value: "5K+", icon: Users, color: "text-gray-600" }
    ];

    // Enhanced animated background elements
    const floatingVariants = {
        animate: {
            y: [0, -30, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const rotateVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const arrowVariants = {
        animate: {
            x: [0, 20, 0],
            y: [0, -10, 0],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Base Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-gray-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

                {/* Animated Texture Overlay */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,102,0,0.1)_0%,transparent_50%)] animate-pulse" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,102,0,0.08)_0%,transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Floating Orange Elements */}
                <motion.div
                    className="absolute top-32 left-16 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div
                    className="absolute bottom-40 right-20 w-32 h-32 bg-orange-400/15 rounded-full blur-2xl"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: "1.5s" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-600/25 rounded-full blur-lg"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: "2.5s" }}
                />

                {/* Animated Arrows and UI Elements */}
                <motion.div
                    className="absolute top-1/4 right-1/3 text-orange-500/40"
                    variants={arrowVariants}
                    animate="animate"
                >
                    <ArrowRight className="w-8 h-8" />
                </motion.div>

                <motion.div
                    className="absolute bottom-1/3 left-1/5 text-orange-600/30"
                    variants={arrowVariants}
                    animate="animate"
                    style={{ animationDelay: "1s" }}
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>

                <motion.div
                    className="absolute top-2/3 right-1/4 text-orange-400/40"
                    variants={arrowVariants}
                    animate="animate"
                    style={{ animationDelay: "2s" }}
                >
                    <ArrowUp className="w-7 h-7" />
                </motion.div>

                {/* Rotating Circles and Shapes */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-20 h-20 border-2 border-orange-500/20 rounded-full"
                    variants={rotateVariants}
                    animate="animate"
                />

                <motion.div
                    className="absolute bottom-1/4 right-1/3 w-12 h-12 border border-orange-400/30 rounded-full"
                    variants={rotateVariants}
                    animate="animate"
                    style={{ animationDelay: "3s" }}
                />

                {/* Pulsing Dots */}
                <motion.div
                    className="absolute top-1/2 left-1/6 w-4 h-4 bg-orange-500/60 rounded-full"
                    variants={pulseVariants}
                    animate="animate"
                />
                <motion.div
                    className="absolute top-3/4 right-1/6 w-3 h-3 bg-orange-600/50 rounded-full"
                    variants={pulseVariants}
                    animate="animate"
                    style={{ animationDelay: "1.5s" }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/5 w-5 h-5 bg-orange-400/40 rounded-full"
                    variants={pulseVariants}
                    animate="animate"
                    style={{ animationDelay: "2.5s" }}
                />

                {/* Marketing Elements */}
                <motion.div
                    className="absolute top-1/5 right-1/2 text-orange-500/30"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Target className="w-8 h-8" />
                </motion.div>

                <motion.div
                    className="absolute bottom-1/5 left-1/2 text-orange-600/25"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <BarChart3 className="w-6 h-6" />
                </motion.div>

                {/* Grid Pattern with Animation */}
                <motion.div
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,102,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,102,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,102,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,102,0,0.03)_1px,transparent_1px)]"
                    animate={{
                        backgroundPosition: ['0px 0px', '60px 60px']
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Enhanced Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Badge className="mb-8 glass-effect text-orange-600 hover:bg-transparent dark:text-orange-400 border-orange-200 dark:border-orange-800 text-base px-6 py-3  transition-transform shadow-lg rounded-full font-medium relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            <Phone className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">Bulk Calling Platform</span>
                        </Badge>
                    </motion.div>

                    {/* Enhanced Main Headline */}
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-6 md:leading-[1.2] leading-snug tracking-tight"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <span className="text-gray-900 dark:text-white block font-bold">
                            Transform Your Outreach with
                        </span>
                        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent block my-2 font-bold">
                            Smart Bulk Calling
                        </span>
                    </motion.h1>

                    {/* Enhanced Description */}
                    <motion.p
                        className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8  max-w-4xl mx-auto leading-relaxed font-medium"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Reach thousands with <span className="text-orange-600 dark:text-orange-400 font-semibold">one-tap campaigns</span>.
                        Perfect for marketing teams, event organizers, and community managers who need{" "}
                        <span className="text-gray-900 dark:text-white font-semibold">powerful automation</span> at scale.
                    </motion.p>

                    {/* Enhanced CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 group rounded-xl font-semibold relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="relative z-10 flex items-center">
                                    Start Free Trial
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.div>
                                </span>
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass-effect hover:bg-orange-50/90 dark:hover:bg-gray-800/20 shadow-lg transition-all duration-300 rounded-xl font-semibold border-2 border-orange-200 dark:border-gray-700">
                                <Play className="mr-2 h-5 w-5" />
                                Watch Demo
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Stats Grid */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        {statsData.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-white/20 dark:border-gray-700/30 min-h-48">
                                    <motion.div
                                        className={`rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-4 ${stat.color.includes('orange') ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                            'bg-gradient-to-r from-gray-500 to-gray-600'
                                            } group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10`}
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </motion.div>
                                    <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{stat.value}</div>
                                    <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium relative z-10">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Trust Indicators */}
                    <motion.div
                        className="flex items-center justify-center flex-wrap gap-6 md:gap-8 text-sm text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <motion.div
                            className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="w-2 h-2 bg-orange-500 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="font-medium">Trusted by 5,000+ Teams</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center space-x-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="w-2 h-2 bg-gray-500 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                            />
                            <span className="font-medium">99.9% Uptime</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center space-x-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="w-2 h-2 bg-orange-400 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                            />
                            <span className="font-medium">24/7 Support</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ModernHero;
