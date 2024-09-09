import { supabase } from "./supabase";

export const emailDbValidator = async (studentEmail) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("email")
      .eq("email", studentEmail);

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    console.log("error while fetching the email", error.message);
    return false;
  }
};
