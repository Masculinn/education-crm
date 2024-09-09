import { resetLoading, setLoading } from "@/stores/slices/loadingSlice";
import { supabase } from "./supabase";
import alertModal from "../assistants/alertModal";

export default async function addFeedback(props, dispatch) {
  try {
    dispatch(
      setLoading({
        loading: true,
      })
    );
    const { data, error } = await supabase.from("feedbacks").insert(props);

    if (error) {
      throw error;
    }
    alertModal({
      toastIcon: "success",
      toastTitle: "Rapor başarıyla oluşturuldu",
    });

    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Rapor gönderilirken hata oluştu: ${
        error.message || error.message.description
      } `,
    });
  } finally {
    dispatch(resetLoading());
  }
}
