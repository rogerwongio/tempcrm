import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, User } from "lucide-react";

import { type Lead } from "@/lib/api/leads";
import { formatDate } from "@/lib/utils/date";

interface LeadDetailsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  lead?: Lead;
}

const LeadDetailsDialog = ({
  open = true,
  onOpenChange = () => {},
  lead = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    company: "Acme Corp",
    notes: "Met at the tech conference. Interested in enterprise solutions.",
    createdAt: "2024-03-15",
    lastContact: "2024-03-20",
  },
}: LeadDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Lead Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-medium">{lead.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium">{lead.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-lg font-medium">{lead.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-lg font-medium">{lead.company}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {lead.notes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="text-base font-medium">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-base font-medium">
                    {formatDate(lead.last_contact)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
