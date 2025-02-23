import { supabase } from "../supabase";

interface Comment {
  id: string;
  lead_id: string | null;
  content: string;
  created_at: string | null;
  updated_at: string | null;
}

const getComments = async (leadId: string) => {
  const { data, error } = await supabase
    .from("lead_comments")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

const createComment = async (comment: { lead_id: string; content: string }) => {
  const { data, error } = await supabase
    .from("lead_comments")
    .insert([comment])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateComment = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from("lead_comments")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export type { Comment };
export { getComments, createComment, updateComment };
