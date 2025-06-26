import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface CallTrendChartProps {
    timeframe: string;
    campaign: string;
}

const CallTrendChart = ({ timeframe }: CallTrendChartProps) => {
    const [chartType, setChartType] = useState("area");

    const data = [
        { date: "Jan 1", calls: 1200, answered: 840, missed: 240, rejected: 120 },
        { date: "Jan 2", calls: 1450, answered: 1015, missed: 290, rejected: 145 },
        { date: "Jan 3", calls: 1180, answered: 826, missed: 236, rejected: 118 },
        { date: "Jan 4", calls: 1620, answered: 1134, missed: 324, rejected: 162 },
        { date: "Jan 5", calls: 1380, answered: 966, missed: 276, rejected: 138 },
        { date: "Jan 6", calls: 1750, answered: 1225, missed: 350, rejected: 175 },
        { date: "Jan 7", calls: 1590, answered: 1113, missed: 318, rejected: 159 },
        { date: "Jan 8", calls: 1420, answered: 994, missed: 284, rejected: 142 },
        { date: "Jan 9", calls: 1680, answered: 1176, missed: 336, rejected: 168 },
        { date: "Jan 10", calls: 1520, answered: 1064, missed: 304, rejected: 152 },
        { date: "Jan 11", calls: 1890, answered: 1323, missed: 378, rejected: 189 },
        { date: "Jan 12", calls: 1720, answered: 1204, missed: 344, rejected: 172 }
    ];

    const chartConfig = {
        calls: { label: "Total Calls", color: "#3b82f6" },
        answered: { label: "Answered", color: "#10b981" },
        missed: { label: "Missed", color: "#f59e0b" },
        rejected: { label: "Rejected", color: "#ef4444" }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-0 shadow-sm bg-white dark:bg-gray-900">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Call Volume Trends
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                {timeframe} overview of call performance
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant={chartType === "area" ? "default" : "outline"} size="sm" onClick={() => setChartType("area")}>
                                Area
                            </Button>
                            <Button variant={chartType === "line" ? "default" : "outline"} size="sm" onClick={() => setChartType("line")}>
                                Line
                            </Button>
                            <Button variant={chartType === "bar" ? "default" : "outline"} size="sm" onClick={() => setChartType("bar")}>
                                Bar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                        {chartType === "area" ? (
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area type="monotone" dataKey="calls" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="answered" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                            </AreaChart>
                        ) : chartType === "line" ? (
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="answered" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="missed" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        ) : (
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="calls" fill="#3b82f6" />
                                <Bar dataKey="answered" fill="#10b981" />
                            </BarChart>
                        )}
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Peak Hours Card */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Peak Performance</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Best performing time slots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                                <div className="font-medium text-green-700 dark:text-green-400">10:00 - 11:00 AM</div>
                                <div className="text-sm text-green-600 dark:text-green-500">Best answer rate</div>
                            </div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-400">87%</div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div>
                                <div className="font-medium text-blue-700 dark:text-blue-400">2:00 - 3:00 PM</div>
                                <div className="text-sm text-blue-600 dark:text-blue-500">Highest volume</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">1.8K</div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div>
                                <div className="font-medium text-purple-700 dark:text-purple-400">7:00 - 8:00 PM</div>
                                <div className="text-sm text-purple-600 dark:text-purple-500">Longest duration</div>
                            </div>
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">4m 12s</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CallTrendChart;
