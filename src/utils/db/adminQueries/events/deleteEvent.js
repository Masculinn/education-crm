import { supabase } from "../../supabase";

export default async function deleteEvent(id) {
  try {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Etkinlik silerken hata oluştu ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
