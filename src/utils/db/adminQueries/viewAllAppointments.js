import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function viewAllAppointments() {
  try {
    const { data, error } = await supabase
      .from("student_appointments")
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Randevular veritabanından alınamadı: ${
        error.message || error.message.description
      }`,
    });
  }
}
