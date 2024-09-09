import { supabase } from "./supabase";

export default async function addStudents(props) {
  try {
    const { data, error } = await supabase.from("students").insert({
      ...props,
    });
    if (error) {
      throw error;
    }

    console.log("added student", data);

    return data;
  } catch (error) {
    console.log("Error adding atudents", error.message);
  } 
}
