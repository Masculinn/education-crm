import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function viewProfit(cols) {
  try {
    const { data, error } = await supabase.from("finances").select(`${cols}`);

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Raporlar veritabanından alınamadı: ${
        error.message || error.message.desctiption
      }`,
    });
    return null;
  }
}
