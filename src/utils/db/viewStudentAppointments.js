import { supabase } from "./supabase";

export default async function viewStudentAppointments(id) {
  try {
    const { data, error } = await supabase
      .from("student_appointments")
      .select("*")
      .eq("student_id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.log(`error while fetching data: ${err}`);
  }
}
