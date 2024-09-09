import { supabase } from "../supabase";

export const emailChecker = async (email) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("email")
      .eq("email", email);

    if (error) throw error;

    return data.length > 0;
  } catch (error) {
    console.log("error while fetching the email", error.message);
    return false;
  }
};
