import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function viewStudentDocuments(id) {
  try {
    const { data, error } = await supabase
      .from("students_documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Dökümanlar Yüklenemedi: ${
        error.message.description || error.message
      }`,
    });
  }
}
