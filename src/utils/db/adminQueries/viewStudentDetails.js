import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function viewStudentDetails(id) {
  try {
    const { data, error } = await supabase
      .from("student_details")
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
      toastTitle: `Öğrenci detaylarını görüntülerken bir hata oluştu: ${
        error.message.description || error.message
      }`,
    });
  }
}
