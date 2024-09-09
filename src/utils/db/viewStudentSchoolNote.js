import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function viewStudentSchoolNote(id) {
  try {
    const { data, error } = await supabase
      .from("student_school_notes")
      .select("*")
      .eq("studentID", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Note goruntulunemedi ${
        err.message || err.message.description
      }`,
    });
  }
}
