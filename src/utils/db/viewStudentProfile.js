import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function viewStudentProfile(id) {
  try {
    const { data, error } = await supabase
      .from("students")
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
      toastTitle: `Profil yüklenemedi: ${
        error.message || error.message.desctiption
      }`,
    });
  }
}
