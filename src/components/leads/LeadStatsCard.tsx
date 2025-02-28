import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Lead } from "@/lib/api/leads";
import { format } from "date-fns";

interface LeadStatsCardProps {
  leads?: Lead[];
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

const LeadStatsCard = ({
  leads = [],
  title = "Lead Statistics",
  subtitle = format(new Date(), "MMMM yyyy"),
  icon,
  color = "bg-blue-100 text-blue-800",
}: LeadStatsCardProps) => {
  const count = leads.length;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className={`p-2 rounded-full ${color}`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default LeadStatsCard;
