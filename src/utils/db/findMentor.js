import { setLoading } from "@/stores/slices/loadingSlice";
import { supabase } from "./supabase";

export default async function findMentor(id, dispatch) {
  try {
    dispatch(
      setLoading({
        loading: true,
      })
    );
    const { data } = await supabase
      .from("student_mentorship")
      .select("*")
      .eq("id", id)
      .single();

    return data;
  } finally {
    dispatch(
      setLoading({
        loading: false,
      })
    );
  }
}
