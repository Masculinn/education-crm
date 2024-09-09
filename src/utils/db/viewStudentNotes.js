import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function viewStudentNotes(authorID) {
  try {
    const { data, error } = await supabase
      .from("student_notes")
      .select(`*`)
      .eq("authorID", authorID);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Notları görüntülerken hata oluştu: ${
        error.message || error.message.description
      }`,
    });

    return [];
  }
}
