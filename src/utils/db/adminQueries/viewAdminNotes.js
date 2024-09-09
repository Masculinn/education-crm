import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function viewAdminNotes() {
  try {
    const { data, error } = await supabase.from("admin_notes").select("*");

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Notları görüntülerken hata oluştu: ${
        error.message || error.message.description
      }`,
    });

    return [];
  }
}
