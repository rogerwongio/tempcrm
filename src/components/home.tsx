import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getLeads, deleteLead, updateLead, type Lead } from "@/lib/api/leads";
import LeadManagementHeader from "./leads/LeadManagementHeader";
import LeadTable from "./leads/LeadTable";

import { Pagination } from "@/components/ui/pagination";

const Home = () => {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      loadLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };

  const handleSort = (column: keyof Lead) => {
    console.log("Sorting by:", column);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateLead(id, { status });
      toast({
        title: "Status Updated",
        description: `Lead status changed to ${status}`,
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
  };

  const handleAddContact = () => {
    navigate("/leads/new");
  };

  const handleEdit = (id: string) => {
    navigate(`/leads/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Lead Management
        </h1>

        <LeadManagementHeader
          onSearch={handleSearch}
          onAddContact={handleAddContact}
        />

        <div className="mt-6">
          <LeadTable
            leads={leads}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            pageCount={5}
            page={1}
            onPageChange={(page) => console.log("Page changed:", page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
