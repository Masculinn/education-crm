import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function deleteFinanceReport({ id }) {
  try {
    const { error } = await supabase.from("finances").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Rapor Silinirken bir hata oluştu: ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
