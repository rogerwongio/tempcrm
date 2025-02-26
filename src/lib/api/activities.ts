import { supabase } from "../supabase";

export interface Activity {
  id: string;
  lead_id: string;
  type: string;
  details: string;
  user_id: string;
  created_at: string;
}

export const getRecentActivities = async () => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
};

export const createActivity = async (
  activity: Omit<Activity, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("activities")
    .insert([activity])
    .select()
    .single();

  if (error) throw error;
  return data;
};
