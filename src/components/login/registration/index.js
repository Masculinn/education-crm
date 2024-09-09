import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setStep } from "@/stores/slices/stepSlice";
import citiesdb from "@/lib/citiesdb";
import { Steps } from "../ui/steps";
import { CgDanger, CgProfile } from "react-icons/cg";
import {
  Button,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import validateEmail from "@/utils/assistants/validateEmail";
import { FaCity } from "react-icons/fa6";
import { setUserData } from "@/stores/slices/authSlice";
import alertModal from "@/utils/assistants/alertModal";
import { emailDbValidator } from "@/utils/db/emailDbValidator";

export const Registration = () => {
  const warningStyle =
    "text-warning-400 text-small w-full h-auto flex flex-row gap-2 pb-1 items-center justify-start";

  const dispatch = useDispatch();
  const [storeData, setStoreData] = useState({
    email: "",
    name: "",
    surname: "",
    city: "",
  });

  const { no, auth } = useSelector((state) => state.step);
  const [error, setError] = useState({
    errEmail: null,
    errName: null,
    errSurname: null,
    errCity: null,
  });
  const { university, university_program } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    const validationRes = await validateInputs(storeData);
    setError(validationRes);

    const isPassed = Object.values(validationRes).every(Boolean);
    if (isPassed) {
      dispatch(
        setUserData({
          email: storeData.email,
          name: storeData.name,
          surname: storeData.surname,
          city: storeData.city,
          university: university,
          university_program: university_program,
        })
      );
      dispatch(
        setStep({
          auth: auth,
          no: no + 1,
        })
      );
    }
  };

  const validateInputs = async (storeData) => {
    const validationRes = {
      errEmail: null,
      errName: null,
      errSurname: null,
      errCity: null,
    };

    if (storeData.email === "" || !validateEmail(storeData.email)) {
      validationRes.errEmail = false;
    } else {
      const emailExists = await emailDbValidator(storeData.email);
      emailExists &&
        alertModal({
          toastIcon: "error",
          toastTitle: "Email sistemde kayıtlı",
        });
      validationRes.errEmail = !emailExists;
    }

    validationRes.errName = storeData.name.length >= 2;
    validationRes.errSurname = storeData.surname.length >= 2;
    validationRes.errCity = Boolean(storeData.city !== "");

    return validationRes;
  };

  return (
    <ScrollShadow
      className="h-[48vh] w-full overflow-y-scroll items-center justify-center"
      hideScrollBar
      offset={25}
    >
      <center>
        <Steps />
      </center>
      <div className="w-full h-auto container items-center justify-center flex flex-col gap-1 mt-4">
        <Input
          type="email"
          variant="bordered"
          isRequired
          label={"Email"}
          isInvalid={error.errEmail === false}
          color={error.errEmail === false ? "warning" : "default"}
          startContent={<CiMail />}
          className="dark w-full"
          onClear={() => {
            setStoreData((prev) => ({
              ...prev,
              email: "",
            }));
          }}
          errorMessage={"Lütfen geçerli bir email girin."}
          value={storeData.email}
          onChange={(e) => {
            setStoreData((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <Input
          type="text"
          isRequired
          variant="bordered"
          label={"Adınız"}
          isInvalid={error.errName === false}
          color={error.errName === false ? "warning" : "default"}
          startContent={<CgProfile />}
          className="dark w-full"
          onClear={() => {
            setStoreData((prev) => ({
              ...prev,
              name: "",
            }));
          }}
          errorMessage={"Isim en az 2 karakterden oluşmalıdır."}
          value={storeData.name}
          onChange={(e) => {
            setStoreData((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
        <Input
          type="text"
          isRequired
          variant="bordered"
          label={"Soyadınız"}
          isInvalid={error.errSurname === false}
          color={error.errSurname === false ? "warning" : "default"}
          startContent={<CgProfile />}
          className="dark w-full"
          onClear={() => {
            setStoreData((prev) => ({
              ...prev,
              surname: "",
            }));
          }}
          errorMessage={"Soyadınız en az 2 karakterden oluşmalıdır."}
          value={storeData.surname}
          onChange={(e) => {
            setStoreData((prev) => ({
              ...prev,
              surname: e.target.value,
            }));
          }}
        />
        <Select
          items={citiesdb}
          isRequired
          label="İkamet ettiğiniz şehir"
          placeholder="Bir şehir seçin"
          className="w-full dark text-white"
          selectionMode="single"
          onSelectionChange={(selectedCity) =>
            setStoreData((prevState) => ({
              ...prevState,
              city: selectedCity.currentKey,
            }))
          }
          startContent={<FaCity />}
          classNames={{
            popoverContent: "dark",
          }}
          value={storeData.city}
        >
          {citiesdb?.map((val) => (
            <SelectItem
              color="default"
              className="dark text-white"
              key={val}
              variant="solid"
            >
              {val}
            </SelectItem>
          ))}
        </Select>
      </div>
      {!Object.values(error).every((val) => val === null) && (
        <div className="w-full h-auto items-center justify-start flex flex-col my-2">
          {!error.errEmail && (
            <p className={`${warningStyle}`}>
              <CgDanger className="w-5 h-5" />
              <span>{"Lütfen geçerli bir email adresi giriniz."}</span>
            </p>
          )}
          {!error.errCity && (
            <p className={`${warningStyle}`}>
              <CgDanger className="w-5 h-5" />
              <span>{"Lütfen şehir seçiniz."}</span>
            </p>
          )}
          {!error.errName && (
            <p className={`${warningStyle}`}>
              <CgDanger className="w-5 h-5" />
              <span>{"Isim en az 2 karakterden oluşmalıdır."}</span>
            </p>
          )}
          {!error.errSurname && (
            <p className={`${warningStyle}`}>
              <CgDanger className="w-5 h-5" />
              <span>{"Soyisim en az 2 karakterden oluşmalıdır."}</span>
            </p>
          )}
        </div>
      )}
      <Button
        className={`w-full dark mb-4 mt-2`}
        onPress={handleRegister}
        color="success"
        size="lg"
        variant="flat"
      >
        KAYIT OL
      </Button>
    </ScrollShadow>
  );
};
