import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function editStudentRegistration(id, status) {
  try {
    const { data, error } = await supabase
      .from("students")
      .update({
        status: status,
      })
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Öğrenci kaydını değiştirirken hata oluştu ${
        err.message || err.message.description
      }`,
    });
    return null;
  }
}
