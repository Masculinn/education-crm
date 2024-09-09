import { supabase } from "../supabase";
import alertModal from "@/utils/assistants/alertModal";

export default async function addAppointment(props, staff, generatedId) {
  const { desc, hour, link, student_id, date } = props;
  try {
    const { error } = await supabase.from("student_appointments").insert({
      id: generatedId,
      date: date,
      hour: hour,
      desc: desc,
      link: link,
      staff: staff,
      student_id: student_id,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Randevuyu oluştururken bir problem yaşadık ${
        error.message || error.message.description
      }`,
    });
    return null;
  }
}
