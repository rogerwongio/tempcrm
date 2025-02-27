import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";

import { type Lead } from "@/lib/api/leads";
import { formatDate } from "@/lib/utils/date";

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

interface LeadTableRowProps {
  lead?: Lead;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const LeadTableRow = ({
  lead = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    company: "Acme Corp",
  },
  onDelete = () => {},
  onStatusChange = () => {},
}: LeadTableRowProps) => {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{lead.company}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={lead.status || "New"}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
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
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{lead.assigned_to || "-"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDate(lead.created_at)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    navigate(`/leads/${lead.id}/edit`, {
                      state: { from: window.location.pathname },
                    })
                  }
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Lead</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(lead.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Lead</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
    </tr>
  );
};

export default LeadTableRow;
