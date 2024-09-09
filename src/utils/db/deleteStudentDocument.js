import { setLoading } from "@/stores/slices/loadingSlice";
import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";

export default async function deleteStudentDocument(id, fileURL, dispatch) {
  try {
    dispatch(
      setLoading({
        loading: true,
      })
    );

    const { data: userData, error: userError } = await supabase
      .from("students_documents")
      .select("*")
      .eq("id", id)
      .single();

    if (userError) {
      throw new Error(
        `Veritabanından öğrenci dökümanı alınırken bir hata oluştu: ${userError.message}`
      );
    }

    if (!userData || Object.keys(userData).length === 0) {
      throw new Error(`Öğrenci dökümanı bulunamadı. ID: ${id}`);
    }

    const filteredData = {
      id: userData?.id,
      created_at: userData?.created_at,
      passport:
        userData.passport && userData?.passport.includes(fileURL)
          ? userData?.passport?.filter((x) => x !== fileURL)
          : userData?.passport,
      visa:
        userData.visa && userData?.visa.includes(fileURL)
          ? userData?.visa?.filter((x) => x !== fileURL)
          : userData?.visa,

      trc:
        userData.trc && userData?.trc.includes(fileURL)
          ? userData?.trc?.filter((x) => x !== fileURL)
          : userData?.trc,

      accommodation:
        userData.accommodation && userData?.accommodation.includes(fileURL)
          ? userData?.accommodation?.filter((x) => x !== fileURL)
          : userData?.accommodation,

      university:
        userData.university && userData?.university.includes(fileURL)
          ? userData?.university?.filter((x) => x !== fileURL)
          : userData?.university,
    };

    const { data: updateData, error: updateError } = await supabase
      .from("students_documents")
      .update(filteredData)
      .eq("id", id);

    if (updateError) {
      throw new Error(
        `Veritabanında döküman URL'leri güncellenirken bir hata oluştu: ${updateError.message}`
      );
    }

    const objectPath = fileURL.split("/").slice(-1)[0];
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from("documents")
      .remove([objectPath]);

    if (deleteError) {
      throw new Error(
        `Doküman depodan silinirken bir hata oluştu: ${deleteError.message}`
      );
    }

    alertModal({
      toastIcon: "success",
      toastTitle: "Doküman başarıyla silindi!",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    alertModal({
      toastIcon: "error",
      toastTitle: `Doküman Silinemedi: ${error.message}`,
    });
  } finally {
    dispatch(
      setLoading({
        loading: false,
      })
    );
  }
}
