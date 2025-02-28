import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadTableRow from "./LeadTableRow";

import { type Lead } from "@/lib/api/leads";

interface LeadTableProps {
  leads?: Lead[];
  onSort?: (column: keyof Lead) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;

  onStatusChange?: (id: string, status: string) => void;
}

const LeadTable = ({
  leads = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      company: "Acme Corp",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      company: "Tech Inc",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "(555) 456-7890",
      company: "Global Ltd",
    },
  ],
  onSort = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
}: LeadTableProps) => {
  return (
    <div className="w-full bg-white rounded-md shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("name")}
                className="hover:bg-transparent"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("company")}
                className="hover:bg-transparent"
              >
                Company
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[130px]">
              <Button
                variant="ghost"
                onClick={() => onSort("status")}
                className="hover:bg-transparent"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("assigned_to")}
                className="hover:bg-transparent"
              >
                Assigned To
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("created_at")}
                className="hover:bg-transparent"
              >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
