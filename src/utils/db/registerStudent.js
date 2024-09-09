import alertModal from "../assistants/alertModal";
import { getDate } from "../assistants/getDate";
import { supabase } from "./supabase";

export default async function registerStudent(student) {
  const { id, name, surname, email, city, university, university_program } =
    student;

  try {
    const { data, error } = await supabase.from("students").insert({
      id: id,
      email: email,
      name: name + " " + surname,
      age: "",
      city: city,
      avatar: "",
      university: university,
      program: university_program,
      status: "onaylanmamış",
      phone: "",
      address: "",
    });

    if (error) {
      throw new Error(
        `Öğrenci verisi ana dizine eklenirken hata oluştu: ${
          error.message.description || error.message
        }`
      );
    } else {
      const { error } = await supabase.from("student_details").insert({
        id: id,
      });

      if (error) {
        throw new Error(
          `Öğrenci detay bilgileri verisi dizine eklenirken hata oluştu: ${
            error.message.description || error.message
          }`
        );
      } else {
        const { error } = await supabase.from("student_mentorship").insert({
          id: id,
          mentor_name: "Mukan Olcayto",
          mentor_phone: "+48574422906",
          mentor_avatar:
            "https://atlanticvalleypartners.com/atlantic/partners/mukan.jpg",
          mentor_id: "2537dd6f-d4cb-40b3-a80d-477ad5a66bad",
          mentor_note: "",
        });
        if (error) {
          throw new Error(
            `Öğrenci mentör bilgileri verisi dizine eklenirken hata oluştu: ${
              error.message.description || error.message
            }`
          );
        } else {
          const { error } = await supabase.from("students_documents").insert({
            id: id,
            created_at: getDate(),
          });
          if (error) {
            throw new Error(
              `Öğrenci döküman bilgileri verisi dizine eklenirken hata oluştu: ${
                error.message.description || error.message
              }`
            );
          } else {
            return true;
          }
        }
      }
    }
  } catch (error) {
    alertModal({
      toastIcon: "error",
      toastTitle: error,
    });
    return null;
  }
}
