import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function viewAllStudents(select) {
  try {
    const { data, error } = await supabase.from("students").select(`${select}`);

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Öğrenciler veritabanından alınamadı: ${
        error.message || error.message.desctiption
      }`,
    });
    return null;
  }
}
