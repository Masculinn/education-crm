import { setDocumentSetting } from "@/stores/slices/studentDocumentManager";
import { EditIcon } from "../icons/EditIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { Button, Chip } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { CiWarning } from "react-icons/ci";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { ConfirmedAnimation } from "../loading/ConfirmedAnimation";

export const DocumentActions = () => {
  const dispatch = useDispatch();
  const { action } = useSelector((state) => state.studentProfileActions);
  const { phone, address, avatar, semestr, age } = useSelector(
    (state) => state.login
  );
  const { state } = useSelector((state) => state.responsive);
  const [profileState, setProfileState] = useState(null);

  useEffect(() => {
    const profileFields = [phone, address, avatar, semestr, age];
    const emptyFields = profileFields.filter((field) => field === "");

    if (emptyFields.length === profileFields.length) {
      setProfileState("uncompleted");
    } else if (emptyFields.length > 0) {
      setProfileState("completing");
    } else {
      setProfileState("completed");
    }
  }, [phone, address, avatar, semestr, age, profileState]);

  return (
    <>
      <aside className="w-full h-auto lg:py-4 pt-4 items-center justify-between lg:px-8 flex lg:flex-row flex-col gap-2">
        <div className="lg:w-1/3 w-full h-auto lg:items-start lg:justify-start justify-center items-center flex">
          <Chip
            className="lg:w-1/2 w-full dark lg:px-8 px-24   py-6  font-bold"
            radius={state ? "md" : "full"}
            endContent={
              profileState === "completed" ? (
                <ConfirmedAnimation h={24} w={24} />
              ) : profileState === "completing" ? (
                <CiWarning className="w-6 h-6" />
              ) : (
                <VscError className="w-6 h-6" />
              )
            }
            color={
              profileState === "completed"
                ? "success"
                : profileState === "completing"
                ? "warning"
                : "error"
            }
            variant="bordered"
            classNames={{ content: "font-extrabold tracking-wide" }}
          >
            {profileState === "completed" && "Profil tamamlanmış"}
            {profileState === "completing" && "Profil tamamlanmamış"}
            {profileState === "uncompleted" && "Profil eksik"}
          </Chip>
        </div>
        <div className="lg:w-2/3 w-full h-auto lg:items-end lg:justify-end items-center justify-center flex flex-row gap-2 ">
          <Button
            startContent={<EyeIcon />}
            className="dark lg:w-1/3 w-1/2"
            color="primary"
            variant={action === "view" ? "solid" : "ghost"}
            size="lg"
            onClick={() => {
              dispatch(
                setDocumentSetting({
                  action: "view",
                })
              );
            }}
          >
            Görüntüle
          </Button>
          <Button
            className="dark lg:w-1/3 w-1/2"
            color="warning"
            variant={action === "edit" ? "solid" : "ghost"}
            size="lg"
            startContent={<EditIcon />}
            onClick={() => {
              dispatch(
                setDocumentSetting({
                  action: "edit",
                })
              );
            }}
          >
            Değişiklik Yap
          </Button>
        </div>
      </aside>
    </>
  );
};
