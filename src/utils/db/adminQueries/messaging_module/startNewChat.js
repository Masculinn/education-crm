import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function startNewChat(props) {
  const { id, sender, receiver, time, metadata } = props;
  try {
    const { error } = await supabase.from("messages").insert({
      id: id,
      sender: sender,
      receiver: receiver,
      time: time,
      metadata: metadata,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Sohbet başlatılırken hata oluştu: ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
