import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, FileText, Send, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatDate } from "@/lib/utils/date";
import { getLeads } from "@/lib/api/leads";
import { getRecentActivities } from "@/lib/api/activities";

type ActivityType = {
  id: string;
  lead_id: string;
  type: string;
  details: string;
  user_id: string;
  created_at: string;
};
import { supabase } from "@/lib/supabase";

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    activeLeads: 0,
    proposalsSent: 0,
    quotationsSent: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityType[]>([]);
  const [currentMonthData, setCurrentMonthData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [statusData, setStatusData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    loadData();
    setupRealtimeSubscription();
    return () => {
      supabase.channel("activities").unsubscribe();
    };
  }, []);

  const setupRealtimeSubscription = () => {
    supabase
      .channel("activities")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activities" },
        () => {
          loadData();
        },
      )
      .subscribe();
  };

  const loadData = async () => {
    try {
      // Load leads and calculate metrics
      const leads = await getLeads();
      const activeLeads = leads.filter(
        (lead) =>
          !["Won", "Lost", "Unqualified", "On Hold"].includes(
            lead.status || "",
          ),
      ).length;
      const proposalsSent = leads.filter(
        (lead) => lead.status === "Proposal Sent",
      ).length;
      const quotationsSent = leads.filter(
        (lead) => lead.status === "Quotation Sent",
      ).length;

      setMetrics({
        activeLeads,
        proposalsSent,
        quotationsSent,
      });

      // Load recent activities
      const activities = await getRecentActivities();
      setRecentActivity(activities);

      // Calculate current month data
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const currentMonthLeads = leads.filter(
        (lead) => new Date(lead.created_at) >= firstDayOfMonth,
      );

      setCurrentMonthData([
        { name: "New Leads", value: currentMonthLeads.length },
        {
          name: "Proposals",
          value: currentMonthLeads.filter((l) => l.status === "Proposal Sent")
            .length,
        },
        {
          name: "Quotations",
          value: currentMonthLeads.filter((l) => l.status === "Quotation Sent")
            .length,
        },
        {
          name: "Won",
          value: currentMonthLeads.filter((l) => l.status === "Won").length,
        },
      ]);

      // Calculate status distribution
      const statusCounts = leads.reduce((acc, lead) => {
        const status = lead.status || "New";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setStatusData(
        Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
        })),
      );
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Overview Metrics */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proposals Sent
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.proposalsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quotations Sent
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.quotationsSent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col space-y-1 border-b border-gray-100 pb-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <span className="text-xs text-gray-500">
                      by {activity.user_id || "System"}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Month Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentMonthData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#3b82f6"
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
