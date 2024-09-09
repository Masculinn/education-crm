import alertModal from "../assistants/alertModal";
import idGenerator from "../assistants/idGenerator";
import { supabase } from "./supabase";

export default async function addStudentSchoolNote(props, studentID) {
  const { header, date, note } = props;
  try {
    const { data, error } = await supabase.from("student_school_notes").insert({
      id: idGenerator(12, "number"),
      header: header,
      date: date,
      note: note,
      studentID: studentID,
    });

    if (error) {
      throw error;
    }
    return data;
  } catch (err) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Note eklenemedi: ${err.message || err.message.description}`,
    });
  }
}
