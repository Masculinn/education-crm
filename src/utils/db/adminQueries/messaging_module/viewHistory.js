import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function viewHistory(sender) {
  try {
    const { data: firstData, error: firstError } = await supabase
      .from("messages")
      .select("id")
      .or(`sender.eq.${sender},receiver.eq.${sender}`)
      .limit(1);

    if (firstError) throw firstError;

    if (firstData.length > 0) {
      const { data: chatData, error: chatError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender.eq.${sender}, receiver.eq.${sender}`);

      if (chatError) {
        alertModal({
          toastIcon: "error",
          toastTitle: `Sohbet bulundu ancak sohbetleri çekerken hata oluştu: ${chatError.message}`,
        });
        return null;
      } else {
        return chatData;
      }
    }

    return null;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Mesajlari çekerken bir hata oluştu: ${error.message}`,
    });
    return null;
  }
}
