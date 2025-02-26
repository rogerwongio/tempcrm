import { supabase } from "../supabase";

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {string} lead_id
 * @property {string} type
 * @property {string} details
 * @property {string} user_id
 * @property {string} created_at
 */

/**
 * @returns {Promise<Activity[]>}
 */
export const getRecentActivities = async () => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
};

/**
 * @param {Omit<Activity, 'id' | 'created_at'>} activity
 * @returns {Promise<Activity>}
 */
export const createActivity = async (activity) => {
  const { data, error } = await supabase
    .from("activities")
    .insert([activity])
    .select()
    .single();

  if (error) throw error;
  return data;
};
