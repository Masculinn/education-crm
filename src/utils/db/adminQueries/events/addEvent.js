import { supabase } from "../../supabase";
import deleteEvent from "./deleteEvent";

export default async function addEvent(params) {
  try {
    if (params.eventType === "card") {
      const { error } = await supabase.from("events").insert(params);
      if (error) throw error;
      return true;
    } else {
      const { data: selectedEvent, error } = await supabase
        .from("events")
        .select("id")
        .eq("eventType", params.eventType)
        .single();
      if (error) throw error;
      if (selectedEvent) {
        const deleteEv = await deleteEvent(selectedEvent.id);
        if (deleteEv) {
          const { error } = await supabase.from("events").insert(params);
          if (error) throw error;
          return true;
        } else {
          return false;
        }
      }
    }
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Etkinlik eklerken hata oluştu ${
        error.message || error.message.description
      }`,
    });
    return false;
  }
}
