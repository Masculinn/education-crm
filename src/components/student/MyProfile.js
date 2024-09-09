import { useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { GrStatusGoodSmall } from "react-icons/gr";
import { ProfileInput } from "../utils/ProfileInput";
import { useSelector } from "react-redux";
import viewStudentProfile from "@/utils/db/viewStudentProfile";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import alertModal from "@/utils/assistants/alertModal";
import { AvatarForm } from "../utils/AvatarForm";
import updateStudentData from "@/utils/db/updateStudentData";

export const MyProfile = () => {
  const { id } = useSelector((state) => state.login);
  const { action } = useSelector((state) => state.studentProfileActions);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    avatar: "",
    email: "",
    age: "",
    program: "",
    university: "",
    status: "",
    city: "",
    phone: "",
    address: "",
    registration_date: "",
    university_semester: "",
    isVisaCompleted: false,
    isTrcCompleted: false,
    isUniversityRegistrationProcessCompleted: false,
    isMentorShipCompleted: false,
  });

  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await viewStudentProfile(id).finally(() => {
        setLoading(false);
      });
      setData((prev) => ({
        ...prev,
        ...profile,
        registration_date: profile.created_at,
      }));
      setEditedData([]);
    };

    fetchProfile();
  }, [id]);

  const handleInputChange = (content, value) => {
    setEditedData((prev) => ({
      ...prev,
      [content]: value,
    }));
  };

  const saveChanges = async () => {
    const check = Object.values(editedData).every((val) => val === "");
    if (!check) {
      setLoading(true);
      const updateData = await updateStudentData(editedData, id).finally(() => {
        setLoading(false);
      });
      if (updateData) {
        alertModal({
          toastIcon: "success",
          toastTitle: "Profiliniz Başarıyla Güncellendi!",
        });
      } else {
        alertModal({
          toastIcon: "success",
          toastTitle: "Profiliniz Güncellenemedi!",
        });
      }
    } else {
      setLoading(false);
      alertModal({
        toastIcon: "error",
        toastTitle: "Profiliniz Güncellenemedi, bir değişiklik yapmadınız.",
      });
    }
    console.log(editedData);
  };

  if (loading) {
    return (
      <>
        <LoadingSkeleton
          isWidthFull
          maxW={"500"}
          mode={"label"}
          repeat={1}
          textLine={2}
        />
        <LoadingSkeleton
          mode={"text"}
          maxW={"400"}
          repeat={4}
          isWidthFull
          textLine={4}
        />
      </>
    );
  }

  return (
    <div className="w-full h-auto items-start justify-start flex flex-col ">
      <AvatarForm
        email={data?.email}
        name={data?.name}
        phone={data?.phone}
        src={data?.avatar}
        id={id}
      />
      <hr className=" border-white/50 w-full self-center mt-2" />
      <div className="w-full h-auto gap-2 items-center justify-center flex flex-col dark">
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2 mt-4">
          <ProfileInput
            content={"city"}
            label={"Şehir"}
            val={data?.city || ""}
            onChange={handleInputChange}
          />
          <ProfileInput
            content={"address"}
            label={"Adres"}
            val={data?.address || ""}
            onChange={handleInputChange}
          />
        </div>
        <Input
          value={data?.status}
          label={"Kayıt Durumunuz"}
          color={
            data?.status === "onaylanmış"
              ? "success"
              : data?.status === "beklemede"
              ? "warning"
              : "danger"
          }
          readOnly
          startContent={<GrStatusGoodSmall className="w-4 h-4" />}
          val={data?.status || ""}
          isFullWidth
        />
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2 ">
          <ProfileInput
            content={"university"}
            label={"Üniversiteniz"}
            val={data?.university || ""}
          />
          <ProfileInput
            content={"program"}
            label={"Bölümünüz"}
            val={data?.program || ""}
            onChange={handleInputChange}
          />
          <ProfileInput
            content={"university_semester"}
            label={"Sömestr"}
            val={data?.university_semester || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2 ">
          <ProfileInput
            content={"registration_date"}
            label={"Kayıt Tarihi"}
            val={data?.registration_date || ""}
            onChange={handleInputChange}
          />
          <ProfileInput
            content={"age"}
            label={"Yaşınız"}
            val={data?.age || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2">
          <ProfileInput
            content={"phone"}
            label={"Telefon Numaranız"}
            isFullWidth
            val={data?.phone || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2">
          <ProfileInput
            content={"isUniversityRegistrationProcessCompleted"}
            label={"Üniversite Kayıt İşlemleri"}
            isBool
            val={data?.isUniversityRegistrationProcessCompleted || ""}
            onChange={handleInputChange}
          />
          <ProfileInput
            content={"isMentorShipCompleted"}
            label={"Mentör Programım"}
            isBool
            val={data?.isMentorShipCompleted || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full h-auto items-center justify-center flex flex-row gap-2">
          <ProfileInput
            content={"isVisaCompleted"}
            label={"Vize İşlemleri"}
            isBool
            val={data?.isVisaCompleted || ""}
            onChange={handleInputChange}
          />
          <ProfileInput
            content={"isTrcCompleted"}
            label={"Oturum İşlemleri"}
            isBool
            val={data?.isTrcCompleted || ""}
            onChange={handleInputChange}
          />
        </div>
        {action === "edit" && (
          <Button
            color="success"
            variant="flat"
            disabled={loading}
            className="dark w-full mt-2"
            onPress={saveChanges}
          >
            {loading ? "Yükleniyor" : "Değişiklikleri Kaydet"}
          </Button>
        )}
      </div>
    </div>
  );
};
