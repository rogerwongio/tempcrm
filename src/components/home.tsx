import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads, type Lead } from "@/lib/api/leads";
import { format } from "date-fns";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Home = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = format(new Date(), "MMMM yyyy");

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const thisMonthLeads = leads.filter(
    (lead) =>
      lead.created_at &&
      new Date(lead.created_at).getMonth() === new Date().getMonth() &&
      new Date(lead.created_at).getFullYear() === new Date().getFullYear(),
  );

  const activeLeads = thisMonthLeads.filter(
    (lead) =>
      !["Won", "Lost", "Unqualified", "On Hold"].includes(lead.status || ""),
  );

  const proposalSentLeads = thisMonthLeads.filter(
    (lead) => lead.status === "Proposal Sent",
  );

  const quotationSentLeads = thisMonthLeads.filter(
    (lead) => lead.status === "Quotation Sent",
  );

  const wonDeals = thisMonthLeads.filter((lead) => lead.status === "Won");

  const statusCounts = leads.reduce(
    (acc, lead) => {
      const status = lead.status || "New";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const barChartData = {
    labels: ["Leads Added", "Proposals Sent", "Quotations Sent", "Won Deals"],
    datasets: [
      {
        label: currentMonth,
        data: [
          thisMonthLeads.length,
          proposalSentLeads.length,
          quotationSentLeads.length,
          wonDeals.length,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "#60A5FA", // blue-400
          "#34D399", // green-400
          "#F87171", // red-400
          "#FBBF24", // yellow-400
          "#A78BFA", // purple-400
          "#F472B6", // pink-400
          "#2DD4BF", // teal-400
          "#FB923C", // orange-400
        ],
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeads.length}</div>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proposals Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalSentLeads.length}</div>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quotations Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotationSentLeads.length}
            </div>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals.length}</div>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right" as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
