import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Phone, Bot, Zap, Users, TrendingUp, MessageSquare, Languages } from 'lucide-react';
import VoiceWaveAnimation from './ui/voiceWaveAnimation';

const ModernHero = () => {

    const handleGetStarted = () => {
        // Handle the "Get Started" button click
        console.log("Get Started clicked");

    };


    const statsData = [
        { label: "Voice Campaigns", value: "50K+", icon: MessageSquare, color: "text-red-600" },
        { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-red-600" },
        { label: "Response Time", value: "<2s", icon: Zap, color: "text-orange-500" },
        { label: "Happy Clients", value: "2K+", icon: Users, color: "text-red-500" }
    ];

    const features = [
        "AI-powered voice conversations",
        "One-click mass campaigns",
        "Smart IVR automation",
        "Real-time analytics & insights",
        "AI Voice Agent - Coming Soon!"
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden  pt-24 pb-20">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large animated gradient orbs */}
                <div
                    className="absolute top-1/4 left-1/6 w-[600px] h-[600px] bg-gradient-to-r from-red-500/30 to-orange-500/20 rounded-full blur-3xl"
                // animate={{
                //     x: [0, 150, 0],
                //     y: [0, -80, 0],
                //     scale: [1, 1.3, 1],
                // }}
                // transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />

                <div
                    className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] bg-gradient-to-r from-red-600/25 to-red-400/15 rounded-full blur-3xl"
                // animate={{
                //     x: [0, -120, 0],
                //     y: [0, 100, 0],
                //     scale: [1, 1.2, 1],
                // }}
                // transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                />

                <div className="absolute  inset-0 md:bottom-10 bottom-96 flex items-center justify-center">
                    <VoiceWaveAnimation />
                </div>


                {/* Enhanced floating icons with red theme */}

                <motion.div
                    className="absolute bottom-10 left-10 text-red-500/60"
                // animate={{
                //     y: [0, 20, 0],
                //     x: [0, 15, 0],
                //     scale: [1, 1.1, 1],
                // }}
                // transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Bot className="w-14 h-14 drop-shadow-lg" />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Enhanced Badge */}
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center mb-8"
                    >
                        <Badge className="glass-effect-dark text-red-400 border-red-400/40 text-lg px-8 py-4 hover:scale-105 transition-transform shadow-xl rounded-full font-semibold relative overflow-hidden bg-gray-900/60">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <Bot className="w-5 h-5 mr-3 relative z-10" />
                            <span className="relative z-10">AI Voice Platform</span>
                        </Badge>
                    </motion.div> */}

                    {/* Enhanced Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-10"
                    >
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight md:mb-8 mt-10">
                            <span className="text-primary block font-extrabold drop-shadow-2xl">
                                Reach thousands
                            </span>
                            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent block md:mt-4 font-extrabold drop-shadow-2xl">
                                with one click
                            </span>
                        </h1>
                    </motion.div>

                    {/* Enhanced Description */}
                    <motion.p
                        className="text-lg md:text-2xl text-text max-w-5xl mx-auto leading-relaxed font-medium mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Flaro is the{" "}
                        <span className="text-orange-500 font-extrabold">smart AI voice platform</span>{" "}
                        that simplifies large-scale outreach. Create personalized campaigns, automate call flows,{" "}
                        <span className="text-orange-500 font-bold">and track every response</span>{" "}
                        in real-time. Plus, our upcoming{" "}
                        <span className="text-orange-600 font-bold">AI voice agent</span>{" "}
                        will handle conversations like a human with{" "}
                        <span className="text-orange-500 font-bold">native language support</span>.
                    </motion.p>

                    {/* Enhanced CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row md:gap-8 gap-4 justify-center items-center mb-8 md:mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleGetStarted}
                                size="lg"

                                className="text-lg md:text-xl md:px-12 px-6 md:py-8 py-6 glass-effect-dark border-2 border-red-600/60 text-primary hover:bg-orange-500 dark:hover:bg-red-950/40 shadow-xl transition-all duration-300 rounded-2xl font-bold overflow-hidden"
                            >

                                <span className="relative z-10 flex items-center font-bold">
                                    <Sparkles className="mr-4 h-7 w-7" />
                                    Start Free Campaign
                                </span>
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg md:text-xl md:px-12 px-6 md:py-8 py-6 glass-effect-dark border-2 border-red-600/60 text-primary hover:bg-orange-500 dark:hover:bg-red-950/40 shadow-xl transition-all duration-300 rounded-2xl font-bold overflow-hidden"
                            >
                                <Languages className="mr-4 h-6 w-6" />
                                Preview AI Agent (Soon)
                            </Button>
                        </motion.div>
                    </motion.div>


                    {/* Enhanced Interactive Demo Section */}
                    <motion.div
                        className="md:mb-20 mb-12"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <motion.div
                            className="relative max-w-lg mx-auto"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="glass-effect-dark border-2 border-red-700/40 rounded-3xl md:p-10 p-6 bg-gray-900/60 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="md:text-lg text-base  text-text font-medium">Let&apos;s Talk</div>
                                    <div className="md:text-lg text-base  text-red-400 font-semibold flex items-center">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                        Ready
                                    </div>
                                </div>

                                <motion.div
                                    className="w-full h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden"
                                    whileHover={{ backgroundColor: "rgb(55, 65, 81)" }}
                                >
                                    <span className="text-gray-200 dark:text-gray-400 md:text-lg text-base  font-medium">Enter Phone Number</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>

                                <motion.button
                                    className="w-full md:py-6 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl text-primary font-bold text-xl relative overflow-hidden shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span className="relative z-10 md:text-lg text-base flex items-center justify-center">
                                        <Phone className="mr-3 h-6 w-6" />
                                        Coming Soon
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                        <motion.div
                            className="absolute tops-40 right-20 text-red-400/60"
                            animate={{
                                y: [0, -30, 0],
                                rotate: 360,
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                        </motion.div>

                    </motion.div>

                    {/* Enhanced Stats Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        {statsData.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.05 }}
                            >
                                <div className="glass-effect-dark rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-red-700/40 bg-gray-900/40">
                                    <div
                                        className="rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-gradient-to-r from-gray-50  dark:from-red-600/40 dark:to-red-500/20   group-hover:scale-110 transition-transform duration-300 shadow-xl relative z-10"
                                    >
                                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-primary mb-3 relative z-10">{stat.value}</div>
                                    <div className="text-base text-gray-300 font-semibold relative z-10">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Features List */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-8 text-gray-600 dark:text-gray-400 mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 hover:text-red-400 transition-colors text-lg"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                            >
                                <motion.div
                                    className="w-3 h-3 bg-red-500 rounded-full shadow-lg"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.6, 1, 0.6],
                                        boxShadow: [
                                            '0 0 8px rgba(255, 0, 0, 0.3)',
                                            '0 0 16px rgba(255, 0, 0, 0.8)',
                                            '0 0 8px rgba(255, 0, 0, 0.3)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                />
                                <span className="font-semibold">{feature}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Partner/Trust Section */}
                    {/* <motion.div
                        className="mt-28 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                    >
                        <p className="text-gray-400 text-lg mb-10 font-medium">Trusted by teams worldwide</p>
                        <div className="flex justify-center items-center space-x-16 opacity-70">
                            {['Marketing Teams', 'Event Organizers', 'Sales Teams', 'Community Managers', 'Enterprise', 'Startups'].map((company, index) => (
                                <motion.div
                                    key={index}
                                    className="text-gray-300 font-semibold text-lg"
                                    whileHover={{ scale: 1.2, opacity: 1, color: '#ff0000' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {company}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div> */}
                </div>
            </div>
        </section>
    );
};

export default ModernHero;

{/* <div className="absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2 rotate-45">
                    <ul className="relative [transform:rotate3d(0,1,0,30deg)]">
                        <li className="absolute left-2/4 top-2/4 w-[30px] h-[30px] -mt-[15px] ml-[5px] z-[-1] border border-[#ef4444] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:0.2s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[60px] h-[60px] -mt-[30px] ml-2.5 z-[-2] border border-[#f04444] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:0.4s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[90px] h-[90px] -mt-[45px] ml-[15px] z-[-3] border border-[#f14a4a] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:0.6s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[120px] h-[120px] -mt-[60px] ml-5 z-[-4] border border-[#f25050] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:0.8s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[150px] h-[150px] -mt-[75px] ml-[25px] z-[-5] border border-[#f35555] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:1s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[180px] h-[180px] -mt-[90px] ml-[30px] z-[-6] border border-[#f55b5b] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:1.2s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[210px] h-[210px] -mt-[105px] ml-[35px] z-[-7] border border-[#f76161] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:1.4s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-60 h-60 -mt-[120px] ml-10 z-[-8] border border-[#f96666] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:1.6s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[270px] h-[270px] -mt-[135px] ml-[45px] z-[-9] border border-[#fb6c6c] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:1.8s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[300px] h-[300px] -mt-[150px] ml-[50px] -z-10 border border-[#fc7272] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:2s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[330px] h-[330px] -mt-[165px] ml-[55px] z-[-11] border border-[#fe7878] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:2.2s]"></li>
                        <li className="absolute left-2/4 top-2/4 w-[360px] h-[360px] -mt-[180px] ml-[60px] z-[-12] border border-[#ff7e7e] rounded-[55%] bg-[#1c1c1c] shadow-[inset_1px_1px_40px_#f87171] animate-spinCustom [animation-delay:2.4s]"></li>
                    </ul>
                </div> */}