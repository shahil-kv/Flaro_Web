
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MessageCircle, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const GetInTouchSection = () => {
    const contactOptions = [
        {
            icon: Phone,
            title: "Schedule a Call",
            description: "Book a 15-minute demo with our team",
            action: "Schedule Now",
            gradient: "from-blue-500 to-cyan-500",
            delay: 0
        },
        {
            icon: MessageCircle,
            title: "Start a Chat",
            description: "Get instant answers to your questions",
            action: "Chat Now",
            gradient: "from-purple-500 to-pink-500",
            delay: 0.2
        }
    ];

    return (
        <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get Started?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose how you'd like to connect with us. Our team is here to help you scale your outreach.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {contactOptions.map((option, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: option.delay }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className="group"
                        >
                            <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-background to-background/80 dark:from-gray-900 dark:to-gray-800 backdrop-blur-xl overflow-hidden relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                <CardContent className="p-8 text-center relative z-10">
                                    <div className={`rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${option.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <option.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4">{option.title}</h3>
                                    <p className="text-muted-foreground mb-8 text-lg">{option.description}</p>
                                    <Button
                                        className={`w-full text-lg py-6 bg-gradient-to-r ${option.gradient} hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                                    >
                                        {option.action}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 mr-3" />
                                <h3 className="text-2xl font-bold">Or reach us directly</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 text-center">
                                <div className="flex items-center justify-center space-x-3">
                                    <Mail className="h-5 w-5" />
                                    <span className="text-lg">hello@flaro.com</span>
                                </div>
                                <div className="flex items-center justify-center space-x-3">
                                    <Phone className="h-5 w-5" />
                                    <span className="text-lg">+1 (555) 123-4567</span>
                                </div>
                            </div>
                            <p className="mt-6 text-lg opacity-90">
                                Available Monday - Friday, 9AM - 6PM EST
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default GetInTouchSection;
