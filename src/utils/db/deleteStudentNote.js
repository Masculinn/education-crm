import { setLoading } from "@/stores/slices/loadingSlice";
import { supabase } from "./supabase";

export default async function deleteStudentNoteById(id, dispatch) {
  try {
    dispatch(
      setLoading({
        loading: true,
      })
    );
    const { data, error } = await supabase
      .from("student_notes")
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
