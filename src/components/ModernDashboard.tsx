
"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import {
    TrendingUp,
    Activity,
    Zap,
    Clock,
    Users,
    Database,
    Shield,
    Globe
} from 'lucide-react';

const ModernDashboard = () => {
    const { scrollY } = useScroll();
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    // Professional performance data
    const performanceData = [
        { time: 'Jan', revenue: 45000, users: 1200, growth: 12 },
        { time: 'Feb', revenue: 52000, users: 1800, growth: 18 },
        { time: 'Mar', revenue: 48000, users: 2100, growth: 15 },
        { time: 'Apr', revenue: 61000, users: 2800, growth: 25 },
        { time: 'May', revenue: 58000, users: 3200, growth: 22 },
        { time: 'Jun', revenue: 73000, users: 4100, growth: 35 }
    ];

    const keyMetrics = [
        {
            title: "Active Users",
            value: "24.8K",
            change: "+12.5%",
            icon: Users,
            color: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-50/50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20"
        },
        {
            title: "Revenue",
            value: "$73K",
            change: "+18.2%",
            icon: TrendingUp,
            color: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20"
        },
        {
            title: "Performance",
            value: "99.9%",
            change: "+0.3%",
            icon: Zap,
            color: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20"
        },
        {
            title: "Response Time",
            value: "42ms",
            change: "-8ms",
            icon: Clock,
            color: "from-gray-500 to-gray-600",
            bgGradient: "from-gray-50/50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/20"
        }
    ];

    return (
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
            {/* Professional Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white/20 to-orange-50/30 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-blue-950/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.05),transparent_50%)]" />

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl floating-animation" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl floating-animation-delayed" />
            </div>

            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <Badge className="mb-6 glass-effect text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-lg px-8 py-3 rounded-full shadow-lg shine-effect">
                        <Activity className="w-5 h-5 mr-3" />
                        Real-time Analytics
                    </Badge>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                        <span className="text-gray-900 dark:text-white">
                            Professional
                        </span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mt-2">Dashboard</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Monitor your business metrics with <span className="text-blue-600 dark:text-blue-400 font-semibold">real-time insights</span>.
                        Track performance, analyze trends, and make data-driven decisions.
                    </p>
                </motion.div>

                <motion.div
                    style={{ y: y2 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {keyMetrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <Card className={`glass-card hover:shadow-2xl transition-all duration-300 shine-effect bg-gradient-to-br ${metric.bgGradient}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg floating-animation`}>
                                                <metric.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <Badge className={`bg-gradient-to-r ${metric.color} text-white border-0 text-sm px-3 py-1 shimmer`}>
                                                {metric.change}
                                            </Badge>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metric.value}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{metric.title}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Card className="glass-card shadow-2xl hover:shadow-3xl transition-all duration-300 shine-effect">
                            <CardHeader className="pb-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                                            Revenue Analytics
                                        </CardTitle>
                                        <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-3">$73,000</div>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">Monthly recurring revenue</p>
                                    </div>
                                    <Badge variant="secondary" className="glass-effect text-blue-600 dark:text-blue-400 border-blue-500/30 text-lg px-4 py-2 rounded-full shine-effect">
                                        Live
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <ChartContainer
                                    config={{
                                        revenue: { label: "Revenue ($)", color: "#3b82f6" },
                                        users: { label: "Users", color: "#8b5cf6" }
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                            <XAxis
                                                dataKey="time"
                                                axisLine={false}
                                                tickLine={false}
                                                className="text-gray-600 dark:text-gray-400 text-sm"
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                className="text-gray-600 dark:text-gray-400 text-sm"
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                strokeWidth={3}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="users"
                                                stroke="#8b5cf6"
                                                fillOpacity={1}
                                                fill="url(#colorUsers)"
                                                strokeWidth={2}
                                                scale={10}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Additional Professional Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                    >
                        {[
                            { icon: Database, value: "2.4TB", label: "Data Processed", color: "from-orange-500 to-orange-600" },
                            { icon: Shield, value: "100%", label: "Secure", color: "from-blue-500 to-blue-600" },
                            { icon: Globe, value: "50+", label: "Countries", color: "from-purple-500 to-purple-600" },
                            { icon: Activity, value: "24/7", label: "Monitoring", color: "from-gray-500 to-gray-600" }
                        ].map((stat, index) => (
                            <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300 text-center shine-effect">
                                <CardContent className="p-6">
                                    <div className={`h-8 w-8 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 floating-animation`}>
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">{stat.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ModernDashboard;
