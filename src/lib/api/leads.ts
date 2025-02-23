import { supabase } from "../supabase";
import type { Database } from "@/types/supabase";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

const getLeads = async () => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const createLead = async (
  lead: Omit<Lead, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("leads")
    .insert([lead])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateLead = async (id: string, lead: Partial<Lead>) => {
  const { data, error } = await supabase
    .from("leads")
    .update(lead)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteLead = async (id: string) => {
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw error;
};

export type { Lead };
export { getLeads, createLead, updateLead, deleteLead };
