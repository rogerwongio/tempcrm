import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  type Lead,
} from "@/lib/api/leads";
import { formatDate } from "@/lib/utils/date";
import LeadManagementHeader from "./leads/LeadManagementHeader";
import LeadTable from "./leads/LeadTable";
import LeadFormDialog from "./leads/LeadFormDialog";
import LeadDetailsDialog from "./leads/LeadDetailsDialog";
import { Pagination } from "@/components/ui/pagination";

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

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

  const handleFormSubmit = async (
    data: Omit<Lead, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      if (formMode === "create") {
        await createLead(data);
        toast({
          title: "Success",
          description: "Lead created successfully",
        });
      } else if (selectedLead) {
        await updateLead(selectedLead.id, data);
        toast({
          title: "Success",
          description: "Lead updated successfully",
        });
      }
      loadLeads();
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          formMode === "create"
            ? "Failed to create lead"
            : "Failed to update lead",
        variant: "destructive",
      });
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

  const handleAddContact = () => {
    setFormMode("create");
    setSelectedLead(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    setSelectedLead(lead);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleView = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    setSelectedLead(lead);
    setIsDetailsOpen(true);
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
            onView={handleView}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            pageCount={5}
            page={1}
            onPageChange={(page) => console.log("Page changed:", page)}
          />
        </div>

        <LeadFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={selectedLead}
          mode={formMode}
        />

        <LeadDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          lead={selectedLead}
        />
      </div>
    </div>
  );
};

export default Home;
