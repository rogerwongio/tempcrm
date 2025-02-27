import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createLead, type Lead } from "@/lib/api/leads";
import LeadForm from "./LeadForm";

const LeadCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const newLead = await createLead(data);
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      navigate("/leads");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  return (
    <LeadForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/")}
    />
  );
};

export default LeadCreatePage;
