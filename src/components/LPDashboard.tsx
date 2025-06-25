import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Phone, Users, Clock, Target, Activity } from 'lucide-react';

const LPDashboard = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, 50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -50]);

    const performanceData = [
        { month: 'Jan', calls: 2400, reached: 1800, conversion: 45 },
        { month: 'Feb', calls: 3200, reached: 2400, conversion: 52 },
        { month: 'Mar', calls: 2800, reached: 2100, conversion: 48 },
        { month: 'Apr', calls: 4200, reached: 3200, conversion: 58 },
        { month: 'May', calls: 3800, reached: 2900, conversion: 55 },
        { month: 'Jun', calls: 5200, reached: 4000, conversion: 62 }
    ];

    const realtimeData = [
        { name: 'Answered', value: 65, color: '#6366f1' },
        { name: 'Busy', value: 25, color: '#f97316' },
        { name: 'No Answer', value: 10, color: '#06b6d4' }
    ];

    const analyticsData = [
        { time: '00:00', calls: 23 },
        { time: '04:00', calls: 56 },
        { time: '08:00', calls: 72 },
        { time: '12:00', calls: 89 },
        { time: '16:00', calls: 95 },
        { time: '20:00', calls: 68 }
    ];

    const statsCards = [
        { title: "Total Calls", value: "24,680", change: "+12%", icon: Phone, color: "from-indigo-500 to-indigo-600" },
        { title: "Success Rate", value: "68.5%", change: "+5.2%", icon: Target, color: "from-green-500 to-green-600" },
        { title: "Active Users", value: "1,247", change: "+18%", icon: Users, color: "from-blue-500 to-blue-600" },
        { title: "Avg Duration", value: "2m 34s", change: "+0.8%", icon: Clock, color: "from-purple-500 to-purple-600" }
    ];

    return (
        <section className="py-24 px-6  relative overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"
                    style={{ y: y1 }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
                    style={{ y: y2 }}
                />
            </div>

            <div className="container px-2 md:px-8 mx-auto z-10">

                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Large Blue/Purple Gradient Orbs */}
                    <motion.div
                        className="absolute -top-32 -right-32 w-[1000px] h-[1000px] bg-gradient-to-bl from-blue-500/20 via-purple-500/15 to-blue-600/12 rounded-full blur-3xl"
                        animate={{
                            x: [0, -180, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.5, 1],
                            rotate: [0, 270, 360],
                        }}
                        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <motion.div
                        className="absolute -bottom-48 -left-48 w-[850px] h-[850px] bg-gradient-to-tr from-purple-600/25 via-blue-500/20 to-purple-400/15 rounded-full blur-3xl"
                        animate={{
                            x: [0, 120, 0],
                            y: [0, -80, 0],
                            scale: [1, 1.3, 1],
                            rotate: [0, -180, 0],
                        }}
                        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    />

                    {/* Medium Gradient Orbs */}
                    <motion.div
                        className="absolute top-1/4 left-1/3 w-[650px] h-[650px] bg-gradient-to-r from-blue-400/18 via-purple-500/14 to-blue-600/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, -90, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.25, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />

                    <motion.div
                        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/22 via-blue-400/18 to-purple-600/14 rounded-full blur-3xl"
                        animate={{
                            x: [0, 110, 0],
                            y: [0, -90, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 7 }}
                    />

                    {/* Small Accent Orbs */}
                    <motion.div
                        className="absolute top-1/6 left-1/5 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/25 to-purple-400/20 rounded-full blur-2xl"
                        animate={{
                            x: [0, 80, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.4, 1],
                        }}
                        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Professional <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Analytics</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Monitor your business metrics with real-time insights. Track performance, analyze trends, and optimize your campaigns.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group"
                        >
                            <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300  border-gray-200 dark:border-gray-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">
                                            {stat.change}
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true, amount: 0.1 }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <Card className="glass-card border-0 shadow-lg h-80 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                    Campaign Performance
                                </CardTitle>
                                <CardDescription>Monthly calls and conversion rates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                        <XAxis dataKey="month" stroke="#6B7280" />
                                        <YAxis stroke="#6B7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="calls" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                                        <Area type="monotone" dataKey="reached" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Real-time Analytics */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.1 }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <Card className="glass-card border-0 shadow-lg h-80 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-green-600" />
                                    Real-time Status
                                </CardTitle>
                                <CardDescription>Current call distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={realtimeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {realtimeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Daily Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="lg:col-span-2"
                        whileHover={{ scale: 1.005 }}
                    >
                        <Card className="glass-card border-0 shadow-lg h-80 hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    Daily Call Activity
                                </CardTitle>
                                <CardDescription>Hourly call volume distribution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={analyticsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                        <XAxis dataKey="time" stroke="#6B7280" />
                                        <YAxis stroke="#6B7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LPDashboard;