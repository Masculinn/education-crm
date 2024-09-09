import { supabase } from "../supabase";
import alertModal from "@/utils/assistants/alertModal";

export default async function addAdminNote(noteData) {
  const { id, author, note, date, avatar } = noteData;

  try {
    const { data, error } = await supabase.from("admin_notes").insert({
      id: id,
      author: author,
      note: note,
      date: date,
      avatar: avatar,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Not eklerken hata oluştu: ${
        error.message || error.message.desctiption
      }`,
    });
  }
}
