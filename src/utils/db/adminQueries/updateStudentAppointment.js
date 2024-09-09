import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function updateStudentAppointment(appointmentData, id) {
  try {
    const { error } = await supabase
      .from("student_appointments")
      .update(appointmentData)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    alertModal({
      toastIcon: "success",
      toastTitle: "Randevu başarıyla güncellendi",
    });
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Randevu Güncellenemedi: ${
        error.message || error.message.description
      }`,
    });
  }
}
