"use client";
import CallTrendChart from "@/components/dashboard/CallTrendChart";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import CampaignOverviewCards from "@/components/dashboard/CampaignOverviewCards";
import ExportReports from "@/components/dashboard/ExportReports";
import GroupHistory from "@/components/dashboard/GroupHistory";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useGet } from "@/lib/useApi";
import { Calendar, ChartNoAxesCombined, History, Target, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";

export default function HomePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const { user } = useAuth();
  const stableUserId = useMemo(
    () => (user?.id != null ? String(user.id) : undefined),
    [user?.id],
  );

  // Fetch analytics overview data
  const {
    data: analyticsData,
  } = useGet<{ data: any }, { userId: string | undefined }>(
    '/report/getOverview',
    { userId: stableUserId },
    {
      showErrorToast: true,
      showSuccessToast: false,
      showLoader: true,
      enabled: !!stableUserId,
    },
  );
  console.log("Analytics Data:", analyticsData);

  return (

    <div className="min-h-full bg-gradient-to-br from-slate-100 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 md:px-8">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <ChartNoAxesCombined className="w-5 h-5 text-white" />
              </div>
              Flaro Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Voice campaign performance insights
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-40">
                <Target className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="promo-2024">Promo 2024</SelectItem>
                <SelectItem value="holiday-sale">Holiday Sale</SelectItem>
                <SelectItem value="product-launch">Product Launch</SelectItem>
              </SelectContent>
            </Select>

            <ExportReports />
          </div>
        </div>

        {/* Campaign Overview Cards */}
        <CampaignOverviewCards timeframe={selectedTimeframe} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[32rem]">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <CallTrendChart timeframe={selectedTimeframe} campaign={selectedCampaign} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GroupHistory />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignAnalytics selectedCampaign={selectedCampaign} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SmartInsights />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
