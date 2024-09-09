import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function updateStudentData(studentData, id) {
  try {
    const { data, error } = await supabase
      .from("students")
      .update({ ...studentData })
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    if (data) return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: error.message || error.message.description,
    });
  }
}
