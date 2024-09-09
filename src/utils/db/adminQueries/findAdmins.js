import alertModal from "@/utils/assistants/alertModal";
import { supabase } from "../supabase";

export default async function findAdmins(email, mode, targetID) {
  switch (mode) {
    case "FIND_ALL":
      try {
        const { data, error } = await supabase.from("admins").select("*");
        if (error) throw error;
        const filtered = data.filter((admin) => admin.email !== email);
        return email === "" || email === null ? filtered : data;
      } catch (error) {
        alertModal({
          toastIcon: "error",
          toastTitle: `Adminleri çekerken hata: ${
            error.message || error.message.description
          }`,
        });
      }
    case "FIND_ONE":
      try {
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("id", targetID)
          .single();
        if (error) throw error;
        return data;
      } catch (error) {
        alertModal({
          toastIcon: "error",
          toastTitle: `Adminleri çekerken hata: ${
            error.message || error.message.description
          }`,
        });
      }
    default:
      return;
  }
}
