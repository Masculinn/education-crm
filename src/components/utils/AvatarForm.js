import { useSelector } from "react-redux";
import alertModal from "@/utils/assistants/alertModal";
import idGenerator from "@/utils/assistants/idGenerator";
import { supabase } from "@/utils/db/supabase";
import { Chip, Card, CardBody, User, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";

export const AvatarForm = ({ src, name, phone, email, id }) => {
  const { action } = useSelector((state) => state.studentProfileActions);
  const [avatarUrl, setAvatarUrl] = useState(src);
  const { auth } = useSelector((state) => state.login);

  useEffect(() => {
    if (src && action === "edit" && auth !== "admin") {
      downloadImage(src);
    }
  }, [src]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatar")
        .download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Lütfen bir fotoğraf seçin.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${idGenerator(16)}.${fileExt}`;
      const filePath = `${fileName}`;
      let fileSize = file.size / 1024 / 1024;
      fileSize = fileSize.toFixed(2);

      if (fileSize > 2) {
        alertModal({
          toastIcon: "error",
          toastTitle: `Dosya 2mb ten büyük olmamalıdır. Yüklediğiniz dosyanın boyutu: ${fileSize}`,
        });
        return;
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log("Upload successful:", uploadData);

      const { data: urlData, error: urlError } = supabase.storage
        .from("avatar")
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const publicURL = urlData.publicUrl;
      console.log("Public URL of the uploaded file:", publicURL);

      const { data: updateData, error: dbError } = await supabase
        .from("students")
        .update({ avatar: publicURL })
        .eq("id", id)
        .single();

      if (dbError) {
        throw dbError;
      }

      console.log("Database update result:", updateData);

      alertModal({
        toastIcon: "success",
        toastTitle: "Profil fotoğrafı başarıyla yüklendi.",
      });

      downloadImage(filePath);
    } catch (error) {
      console.error("Fotoğrafı yüklerken sorun oluştu:", error);
      alertModal({
        toastIcon: "error",
        toastTitle: `${error.message || error.message.description}`,
      });
    }
  };

  return (
    <Card className="w-full mx-auto bg-transparent text-white rounded-xl shadow-md dark">
      {action === "edit" && auth !== "admin" && (
        <>
          <input
            className="cursor-pointer w-full h-auto items-center self-center flex opacity-0"
            label="Profil Fotoğrafı Yükle"
            type="file"
            id="single"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
          <Button
            color="default"
            variant="bordered"
            className="w-auto dark text-slate-200 justify-between mb-2"
            startContent={<span>Profil Fotoğrafı Yükle</span>}
            endContent={<FaArrowRight className="w-4 h-4" />}
            onClick={() => document.getElementById("single").click()}
          />
        </>
      )}

      <CardBody className="flex flex-row items-center justify-between p-4 relative">
        <User
          avatarProps={{ src: avatarUrl || src, alt: name }}
          className="dark cursor-pointer"
          description={phone}
          alt={name}
          name={name}
          classNames={{ base: "scale-110" }}
        />

        <Chip className="dark" variant="flat" color="success">
          {email}
        </Chip>
      </CardBody>
    </Card>
  );
};
