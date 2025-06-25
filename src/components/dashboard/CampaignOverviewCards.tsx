import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Phone, PhoneCall, PhoneMissed, PhoneOff, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface CampaignOverviewCardsProps {
    timeframe: string;
}

const CampaignOverviewCards = ({ }: CampaignOverviewCardsProps) => {
    const stats = [
        {
            title: "Total Calls Made",
            value: "12,453",
            change: 15.2,
            icon: Phone,
            color: "bg-blue-500",
            trend: "up"
        },
        {
            title: "Calls Answered",
            value: "8,721",
            change: 8.5,
            icon: PhoneCall,
            color: "bg-green-500",
            trend: "up",
            percentage: 70
        },
        {
            title: "Calls Missed",
            value: "2,891",
            change: -12.3,
            icon: PhoneMissed,
            color: "bg-yellow-500",
            trend: "down",
            percentage: 23
        },
        {
            title: "Calls Rejected",
            value: "841",
            change: -5.7,
            icon: PhoneOff,
            color: "bg-red-500",
            trend: "down",
            percentage: 7
        },
        {
            title: "Avg Call Duration",
            value: "2m 34s",
            change: 22.1,
            icon: Clock,
            color: "bg-purple-500",
            trend: "up"
        },
        {
            title: "Success Rate",
            value: "70.0%",
            change: 5.2,
            icon: TrendingUp,
            color: "bg-emerald-500",
            trend: "up"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

                return (
                    <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <Badge
                                    variant={stat.trend === "up" ? "default" : "secondary"}
                                    className={`${stat.trend === "up" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"} border-0`}
                                >
                                    <TrendIcon className="w-3 h-3 mr-1" />
                                    {Math.abs(stat.change)}%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {stat.title}
                                </div>
                                {stat.percentage && (
                                    <div className="space-y-1">
                                        <Progress
                                            value={stat.percentage}
                                            className="h-2"
                                        />
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {stat.percentage}% of total calls
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default CampaignOverviewCards;