import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Target, Globe, Languages, Clock, Phone } from "lucide-react";

interface CampaignAnalyticsProps {
    selectedCampaign: string;
}

const CampaignAnalytics = ({ selectedCampaign }: CampaignAnalyticsProps) => {
    const ivrData = [
        { option: "Option 1", value: 3245, percentage: 45, color: "#3b82f6" },
        { option: "Option 2", value: 2156, percentage: 30, color: "#10b981" },
        { option: "Option 3", value: 1234, percentage: 17, color: "#f59e0b" },
        { option: "Hang up", value: 578, percentage: 8, color: "#ef4444" }
    ];

    const regionData = [
        { region: "North America", calls: 4200, success: 85 },
        { region: "Europe", calls: 3100, success: 78 },
        { region: "Asia Pacific", calls: 2800, success: 72 },
        { region: "Latin America", calls: 1900, success: 80 },
        { region: "Middle East", calls: 1200, success: 75 }
    ];

    const languageData = [
        { language: "English", percentage: 65, calls: 8100 },
        { language: "Spanish", percentage: 20, calls: 2500 },
        { language: "French", percentage: 10, calls: 1250 },
        { language: "German", percentage: 5, calls: 625 }
    ];

    return (
        <div className="space-y-6">
            {/* Campaign Header */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Target className="w-5 h-5 text-blue-600" />
                                Campaign: {selectedCampaign === "all" ? "All Campaigns" : selectedCampaign}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Detailed breakdown and performance metrics
                            </CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                            Active
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* IVR Options Breakdown */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Phone className="w-5 h-5 text-purple-600" />
                            IVR Response Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            How callers interacted with your IVR system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="h-48">
                                <ChartContainer config={{}} className="h-full">
                                    <PieChart>
                                        <Pie
                                            data={ivrData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {ivrData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {ivrData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.option}</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                {item.value.toLocaleString()} ({item.percentage}%)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Regional Performance */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Globe className="w-5 h-5 text-green-600" />
                            Regional Performance
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Success rates by geographic region
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {regionData.map((region, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800 dark:text-gray-100">{region.region}</span>
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-gray-900 dark:text-white">{region.success}%</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                {region.calls.toLocaleString()} calls
                                            </div>
                                        </div>
                                    </div>
                                    <Progress value={region.success} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Language Distribution */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Languages className="w-5 h-5 text-orange-600" />
                            Language Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Calls by language preference
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {languageData.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-800 dark:text-gray-100">{lang.language}</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{lang.percentage}%</span>
                                        </div>
                                        <Progress value={lang.percentage} className="h-2" />
                                    </div>
                                    <div className="ml-4 text-right">
                                        <div className="font-bold text-gray-900 dark:text-white">{lang.calls.toLocaleString()}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">calls</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Engagement Metrics */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Engagement Metrics
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Call duration and repeat metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">2m 34s</div>
                                    <div className="text-sm text-blue-600 dark:text-blue-500">Avg Duration</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">12.3%</div>
                                    <div className="text-sm text-purple-600 dark:text-purple-500">Repeat Rate</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-800 dark:text-gray-100">Short calls (&lt;30s)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">23%</span>
                                </div>
                                <Progress value={23} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-800 dark:text-gray-100">Medium calls (30s-2m)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">45%</span>
                                </div>
                                <Progress value={45} className="h-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-800 dark:text-gray-100">Long calls (&gt;2m)</span>
                                    <span className="font-medium text-gray-900 dark:text-white">32%</span>
                                </div>
                                <Progress value={32} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CampaignAnalytics;
