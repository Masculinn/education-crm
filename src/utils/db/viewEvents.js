import { supabase } from "./supabase";

export default async function viewEvents() {
  try {
    const { data, error } = await supabase.from("events").select(`*`);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error while fetching events", error.message);
  }
}
