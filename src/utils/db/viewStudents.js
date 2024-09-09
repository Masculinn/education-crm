import { supabase } from "./supabase";

export default async function viewStudents() {
  try {
    const { data, error } = await supabase
      .from("students")
      .select(`*`);

    if (error) {
      throw error;
    }

    console.log("all student list", data);

    return data;
  } catch (error) {
    console.log("Error while viewing student table", error.message);
  }
}
