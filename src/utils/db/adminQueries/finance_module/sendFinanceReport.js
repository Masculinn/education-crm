import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function sendFinanceReport({ props }) {
  try {
    const { error } = await supabase.from("finances").insert({
      ...props,
      mode: props.mode === "income",
    });

    if (error) throw error;

    alertModal({
      toastIcon: "success",
      toastTitle: "Rapor Başarıyla Oluşturuldu!",
    });
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Rapor gönderilirken bir hata oluştu: ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
