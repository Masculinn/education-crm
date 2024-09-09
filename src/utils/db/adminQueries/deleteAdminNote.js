import { setLoading } from "@/stores/slices/loadingSlice";
import { supabase } from "../supabase";

export default async function deleteAdminNote(id, dispatch) {
  try {
    dispatch(
      setLoading({
        loading: true,
      })
    );
    const { data, error } = await supabase
      .from("admin_notes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  } finally {
    dispatch(
      setLoading({
        loading: false,
      })
    );
  }
}
