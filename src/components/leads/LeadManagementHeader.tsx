import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface LeadManagementHeaderProps {
  onSearch?: (searchTerm: string) => void;
  onAddContact?: () => void;
}

const LeadManagementHeader = ({
  onSearch = () => {},
  onAddContact = () => {},
}: LeadManagementHeaderProps) => {
  return (
    <div className="bg-white w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search leads..."
          className="pl-10 w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button
        onClick={onAddContact}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Lead
      </Button>
    </div>
  );
};

export default LeadManagementHeader;
