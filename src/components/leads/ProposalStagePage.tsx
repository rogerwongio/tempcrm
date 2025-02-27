import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getLeads, updateLead, type Lead } from "@/lib/api/leads";
import { getComments, type Comment } from "@/lib/api/comments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

const ProposalStagePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      const filteredLeads = data.filter((lead) =>
        [
          "Discovery Call Qualified",
          "Proposal Sent",
          "Quotation Sent",
          "Negotiation",
        ].includes(lead.status || ""),
      );
      setLeads(filteredLeads);

      // Load latest comment for each lead
      const commentsPromises = filteredLeads.map((lead) =>
        getComments(lead.id),
      );
      const commentsResults = await Promise.all(commentsPromises);

      const commentsMap: Record<string, Comment[]> = {};
      filteredLeads.forEach((lead, index) => {
        commentsMap[lead.id] = commentsResults[index];
      });

      setComments(commentsMap);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLatestComment = (leadId: string): string => {
    const leadComments = comments[leadId] || [];
    if (leadComments.length === 0) return "-";

    // Sort by created_at in descending order and get the first one
    const sortedComments = [...leadComments].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return sortedComments[0].content;
  };

  const getSourceInfo = (lead: Lead): string => {
    if (lead.campaign) return lead.campaign;
    if (lead.utm) return lead.utm;
    if (lead.gclid) return "Google Ads";
    return "-";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      New: "bg-gray-100 text-gray-800 border-gray-200",
      "AI Called": "bg-blue-100 text-blue-800 border-blue-200",
      Contacted: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Unresponsive: "bg-red-100 text-red-800 border-red-200",
      "Discovery Call Qualified":
        "bg-purple-100 text-purple-800 border-purple-200",
      "Proposal Sent": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Quotation Sent": "bg-orange-100 text-orange-800 border-orange-200",
      Negotiation: "bg-cyan-100 text-cyan-800 border-cyan-200",
      Won: "bg-green-100 text-green-800 border-green-200",
      Lost: "bg-red-100 text-red-800 border-red-200",
      Unqualified: "bg-gray-100 text-gray-800 border-gray-200",
      "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
      "Re-Engaged": "bg-lime-100 text-lime-800 border-lime-200",
    };
    return colors[status] || colors.New;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hot Leads</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proposal Sent At</TableHead>
              <TableHead>Quotation Sent At</TableHead>
              <TableHead>Latest Comment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.website || "-"}</TableCell>
                  <TableCell>{getSourceInfo(lead)}</TableCell>
                  <TableCell>
                    <select
                      value={lead.status || "New"}
                      onChange={async (e) => {
                        try {
                          await updateLead(lead.id, { status: e.target.value });
                          toast({
                            title: "Status Updated",
                            description: `Lead status changed to ${e.target.value}`,
                            variant: "default",
                          });
                          loadLeads();
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to update lead status",
                            variant: "destructive",
                          });
                        }
                      }}
                      className={`block w-full rounded-md text-sm focus:ring-2 focus:ring-offset-2 ${getStatusColor(lead.status || "New")}`}
                    >
                      <option value="New">New</option>
                      <option value="AI Called">AI Called</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Unresponsive">Unresponsive</option>
                      <option value="Discovery Call Qualified">
                        Discovery Call Qualified
                      </option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                      <option value="Unqualified">Unqualified</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Re-Engaged">Re-Engaged</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    {lead.status === "Proposal Sent"
                      ? formatDate(lead.updated_at)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {lead.status === "Quotation Sent"
                      ? formatDate(lead.updated_at)
                      : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {getLatestComment(lead.id)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/leads/${lead.id}/edit`, {
                          state: { from: "/proposals" },
                        })
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-6 text-gray-500"
                >
                  No leads in proposal stage found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProposalStagePage;
