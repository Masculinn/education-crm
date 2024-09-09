import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function addStudentNote(noteData) {
  const { id, authorID, author, note, date } = noteData;

  try {
    const { data, error } = await supabase.from("student_notes").insert({
      id: id,
      authorID: authorID,
      author: author,
      note: note,
      date: date,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Not eklerken hata oluştu: ${
        error.message || error.message.description
      }`,
    });
  }
}
