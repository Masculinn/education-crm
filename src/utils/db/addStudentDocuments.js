import { setLoading } from "@/stores/slices/loadingSlice";
import alertModal from "../assistants/alertModal";
import { supabase } from "./supabase";
import config_documents from "@/config/config_documents";

export default async function uploadDocument(
  id,
  filePath,
  file,
  type,
  dispatch
) {
  if (!config_documents[type]) {
    return;
  } else {
    try {
      dispatch(
        setLoading({
          loading: true,
        })
      );
      const { data: storageData, error: storageError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (storageError) {
        throw new Error(
          `Dosyayı Yüklerken Sorun Oluştu: ${
            storageError.message || storageError.description
          }`
        );
      }

      const { data: getPublicData, error: getPublicDataErr } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (getPublicDataErr) {
        throw new Error(
          `Dosya Bağlantısını alırken sorun oluştu: ${
            getPublicDataErr.message || getPublicDataErr.description
          }`
        );
      }

      const { data: existingData, error: fetchError } = await supabase
        .from("students_documents")
        .select(type)
        .eq("id", id);

      if (fetchError) {
        throw new Error(
          `Dosya sütununda işlem yapılırken hata oluştu: ${
            fetchError.message || fetchError.description
          }`
        );
      }

      if (!existingData || existingData.length === 0) {
        throw new Error(`Bu ID üzerine veri bulunamadı: ${id}`);
      }

      if (existingData.length > 1) {
        throw new Error(`Bu ID üzerinde birden fazla veri seti bulundu: ${id}`);
      }

      const existingUrls = existingData[0][type] || [];

      const updatedUrls = [...existingUrls, getPublicData.publicUrl];

      const { data: updateData, error: updateDataError } = await supabase
        .from("students_documents")
        .update({ [type]: updatedUrls })
        .eq("id", id);

      if (updateDataError) {
        throw new Error(
          `Dökümanı veritabanına kaydederken sorun oluştu: ${
            updateDataError.message || updateDataError.description
          }`
        );
      }

      alertModal({
        toastIcon: "success",
        toastTitle: "Dosya Başarıyla Yüklendi!",
      });
    } catch (error) {
      alertModal({
        toastIcon: "error",
        toastTitle: error.message,
      });
    } finally {
      dispatch(
        setLoading({
          loading: false,
        })
      );
    }
  }
}
