import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function updateFinanceReport({ id, ...props }) {
  try {
    const { error } = await supabase
      .from("finances")
      .update({ ...props })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Rapor güncellenirken bir hata oluştu: ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
