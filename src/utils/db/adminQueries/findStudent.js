import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function findStudent(id) {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Öğrenciyi ararken hata oluştu: ${error}`,
    });
    return null;
  }
}
