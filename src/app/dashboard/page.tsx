"use client";
import CallTrendChart from "@/components/dashboard/CallTrendChart";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import CampaignOverviewCards from "@/components/dashboard/CampaignOverviewCards";
import ExportReports from "@/components/dashboard/ExportReports";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChartNoAxesCombined, Target, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  return (

    <div className="min-h-full bg-gradient-to-br from-slate-100 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trends
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


// <div className=" bg-gray-900 text-white flex flex-col items-center justify-center space-y-6">
//   <h1 className="text-4xl font-bold">Welcome to CoinVerse</h1>
//   <p className="text-gray-400">Access your dashboard sections below:</p>
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//     <Link href="/dashboard/calls">
//       <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
//         <h2 className="text-xl font-semibold">Calls</h2>
//         <p className="text-gray-400">Manage your calls</p>
//       </div>
//     </Link>
//     <Link href="/dashboard/groups">
//       <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
//         <h2 className="text-xl font-semibold">Groups</h2>
//         <p className="text-gray-400">View your groups</p>
//       </div>
//     </Link>
//     <Link href="/dashboard/analytics">
//       <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
//         <h2 className="text-xl font-semibold">Analytics</h2>
//         <p className="text-gray-400">Analyze your data</p>
//       </div>
//     </Link>
//     <Link href="/dashboard/messages">
//       <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
//         <h2 className="text-xl font-semibold">Messages</h2>
//         <p className="text-gray-400">Check your messages</p>
//       </div>
//     </Link>
//     <Link href="/dashboard/settings">
//       <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
//         <h2 className="text-xl font-semibold">Settings</h2>
//         <p className="text-gray-400">Adjust your settings</p>
//       </div>
//     </Link>
//   </div>
// </div>