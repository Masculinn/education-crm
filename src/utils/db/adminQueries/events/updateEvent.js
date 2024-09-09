import alertModal from "@/utils/assistants/alertModal";

export default async function updateEvent(params) {
  try {
    const { data, error } = await supabase
      .from("events")
      .update(params)
      .eq("id", params.id);

    if (error) throw error;
    return data;
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: `Etkinliğı güncellerken hata oluştu ${
        error.message || error.message.description
      }`,
    });
  }
}
