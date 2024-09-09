import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function findAppointments(id) {
  try {
    const { data, error } = await supabase
      .from("student_appointments")
      .select("*")
      .eq("student_id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Randevuları çekerken hata oluştu ${
        error.message || error.message.description
      }`,
    });
  }
}
