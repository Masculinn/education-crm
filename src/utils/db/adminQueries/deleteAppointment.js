import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function deleteAppointment(id) {
  try {
    const { error } = await supabase
      .from("student_appointments")
      .delete()
      .eq("id", id)
      .single();

    if (error) throw error;
    else
      alertModal({
        toastIcon: "success",
        toastTitle: `${id} referans numarası üzerine kayıtlı randevu silindi!`,
      });
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Randevu silinemedi: ${
        error.message.description || error.message
      }`,
    });
  }
}
