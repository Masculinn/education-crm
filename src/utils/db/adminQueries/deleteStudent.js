import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function deleteStudent(id) {
  try {
    const { data, error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Öğrenciyi silerken hata oluştu ${
        error.message || error.message.description
      }`,
    });
  }
}
