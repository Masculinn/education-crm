import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../../supabase";

export default async function sendMessage({ chatID, sender, msg, time }) {
  try {
    const { data: currentChatData, error: fetchError } = await supabase
      .from("messages")
      .select("metadata")
      .eq("id", chatID)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch chat data: ${fetchError.message}`);
    }

    const newMessage = {
      msg,
      time,
      user_id: sender,
    };

    const existingMetadata = currentChatData?.metadata || [];

    const updatedMetadata = [...existingMetadata, newMessage];

    const { data: updatedChatData, error: updateError } = await supabase
      .from("messages")
      .update({
        metadata: updatedMetadata,
      })
      .eq("id", chatID);

    if (updateError) {
      throw new Error(`Failed to update chat data: ${updateError.message}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending message:", error.message);
    alertModal({
      toastIcon: "error",
      toastTitle: `Mesajınız gönderilemedi: ${error.message || error}`,
    });
    return false;
  }
}
