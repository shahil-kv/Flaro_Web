import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Lightbulb,
    TrendingUp,
    Users,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

const SmartInsights = () => {
    const insights = [
        {
            type: "opportunity",
            icon: TrendingUp,
            title: "Re-engage Non-Responders",
            description:
                "2,891 contacts didn't answer. Try calling during different hours for better reach.",
            action: "Schedule Follow-up",
            priority: "high",
            impact: "Potential +15% answer rate",
        },
        {
            type: "performance",
            icon: Clock,
            title: "Optimal Call Time Identified",
            description:
                "Calls made between 10-11 AM show 87% answer rate, 22% higher than average.",
            action: "Adjust Schedule",
            priority: "medium",
            impact: "Estimated +1,200 more answers",
        },
        {
            type: "audience",
            icon: Users,
            title: "High-Response Contact Groups",
            description:
                "Business contacts from North America region show exceptional 85% success rate.",
            action: "Expand Targeting",
            priority: "medium",
            impact: "Scale successful segments",
        },
        {
            type: "efficiency",
            icon: Target,
            title: "IVR Optimization Opportunity",
            description: "8% of callers hang up at IVR. Consider simplifying menu options.",
            action: "Review IVR Flow",
            priority: "low",
            impact: "Reduce 578 drop-offs",
        },
    ];

    const recommendations = [
        {
            title: "Peak Hour Scheduling",
            description: "Schedule 60% of your calls between 10-11 AM for maximum engagement",
            confidence: 94,
        },
        {
            title: "Regional Focus",
            description: "Prioritize North American contacts for higher success rates",
            confidence: 89,
        },
        {
            title: "Follow-up Strategy",
            description: "Wait 2-3 hours before retry calls for better pickup rates",
            confidence: 78,
        },
    ];

    const getIconColor = (type: string) => {
        switch (type) {
            case "opportunity":
                return "text-green-600";
            case "performance":
                return "text-blue-600";
            case "audience":
                return "text-purple-600";
            case "efficiency":
                return "text-orange-600";
            default:
                return "text-slate-600";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
            case "medium":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "low":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                        Smart Insights & Recommendations
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        AI-powered suggestions to optimize your campaign performance
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actionable Insights */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Actionable Insights
                    </h3>
                    {insights.map((insight, index) => {
                        const Icon = insight.icon;
                        return (
                            <Card
                                key={index}
                                className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                            <Icon className={`w-5 h-5 ${getIconColor(insight.type)}`} />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-slate-900 dark:text-white">
                                                    {insight.title}
                                                </h4>
                                                <Badge className={getPriorityColor(insight.priority)}>
                                                    {insight.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {insight.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                    {insight.impact}
                                                </span>
                                                <Button size="sm" variant="outline" className="h-8">
                                                    {insight.action}
                                                    <ArrowRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* AI Recommendations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        AI Recommendations
                    </h3>
                    <Card className="border-0 shadow-sm dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Top Optimization Strategies
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-slate-900 dark:text-white">
                                            {rec.title}
                                        </h4>
                                        <Badge
                                            variant="outline"
                                            className="text-xs dark:border-slate-600 dark:text-slate-300"
                                        >
                                            {rec.confidence}% confidence
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {rec.description}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-sm dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                Attention Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <div className="text-xl font-bold text-red-700 dark:text-red-400">
                                        841
                                    </div>
                                    <div className="text-xs text-red-600 dark:text-red-500">
                                        Rejected Calls
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        Need follow-up
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
                                        578
                                    </div>
                                    <div className="text-xs text-orange-600 dark:text-orange-500">
                                        IVR Dropoffs
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        Menu too complex
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SmartInsights;
