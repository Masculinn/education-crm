import _ from "lodash";
import { supabase } from "../supabase";
import alertModal from "@/utils/assistants/alertModal";

export default async function updateModified(data, studentID) {
  const res = [];
  const updated = [];

  const updateData = async (key, val, table_name) => {
    const isBool = key.startsWith("is");
    try {
      const { error } = await supabase
        .from(table_name)
        .update({
          [key]: isBool ? JSON.parse(val) : val,
        })
        .eq("id", studentID);

      if (error) {
        throw error;
      }

      updated.push(key);
    } catch (error) {
      alertModal({
        toastIcon: "error",
        toastTitle: `Değişiklik yaptığınız ${val} verisi güncellenemedi ${
          error.message.description || error.message
        }`,
      });
    }
  };

  Object.entries(data).forEach(([key, val]) => {
    switch (key) {
      case "details":
        Object.entries(val).forEach(([k, v]) => {
          if (_.isEmpty(v)) res.push("false");
          else res.push("true");
        });
        break;
      case "mentorship":
        Object.entries(val).forEach(([k, v]) => {
          if (_.isEmpty(v)) res.push("false");
          else res.push("true");
        });
        break;
      case "profile":
        Object.entries(val).forEach(([k, v]) => {
          if (_.isEmpty(v)) res.push("false");
          else res.push("true");
        });
        break;
      default:
        break;
    }
  });

  if (res.some((val) => val === "false")) {
    alertModal({
      toastIcon: "error",
      toastTitle: "Veriler boş bırakılamaz lütfen kontrol edin.",
    });
  } else {
    const updatePromises = [];

    Object.entries(data).forEach(([key, val]) => {
      switch (key) {
        case "details":
          Object.entries(val).forEach(([k, v]) => {
            if (_.isEmpty(v)) res.push("false");
            else {
              res.push("true");
              updatePromises.push(updateData(k, v, "student_details"));
            }
          });
          break;
        case "mentorship":
          Object.entries(val).forEach(([k, v]) => {
            if (_.isEmpty(v)) res.push("false");
            else {
              res.push("true");
              updatePromises.push(updateData(k, v, "student_mentorship"));
            }
          });
          break;
        case "profile":
          Object.entries(val).forEach(([k, v]) => {
            if (_.isEmpty(v)) res.push("false");
            else {
              res.push("true");
              updatePromises.push(updateData(k, v, "students"));
            }
          });
          break;
        default:
          break;
      }
    });

    await Promise.all(updatePromises);
  }

  if (updated.length > 0) {
    return alertModal({
      toastIcon: "success",
      toastTitle: `${studentID} numaralı öğrencinin değişiklikleri başarıyla kaydedildi!`,
    });
  }
}
