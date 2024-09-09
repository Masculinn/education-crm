import { Button, colors, Divider, Input, User } from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";
import { useEffect, useRef, useState } from "react";
import { AvatarForm } from "../utils/AvatarForm";
import { useDispatch, useSelector } from "react-redux";
import findStudent from "@/utils/db/adminQueries/findStudent";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import { colorSet } from "../utils/colorSet";
import { valueSet } from "../utils/valueSet";
import { EyeIcon } from "../icons/EyeIcon";
import { EditIcon } from "../icons/EditIcon";
import findMentor from "@/utils/db/findMentor";
import viewStudentDetails from "@/utils/db/adminQueries/viewStudentDetails";
import { Error } from "../utils/Error";
import { BoolInput } from "../utils/BoolInput";
import { TextInput } from "../utils/TextInput";
import { setDocumentSetting } from "@/stores/slices/studentDocumentManager";
import alertModal from "@/utils/assistants/alertModal";
import updateModified from "@/utils/db/adminQueries/updateModified";
import { BiSave } from "react-icons/bi";

const INITIAL_MODE_VALUE = "view";

export const EditStudent = () => {
  const searchRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { id } = useSelector((state) => state.studentView);
  const { state } = useSelector((state) => state.responsive);

  const [student, setStudent] = useState({
    profile: {},
    mentorship: {},
    details: {},
  });
  const [originalStudent, setOriginalStudent] = useState({
    profile: {},
    mentorship: {},
    details: {},
  });
  const [modifiedKeys, setModifiedKeys] = useState({});

  const [searchID, setSearchID] = useState(id);
  const [mode, setMode] = useState(INITIAL_MODE_VALUE);

  useEffect(() => {
    if (searchID !== "") fetchProfile(searchID);
  }, [id, searchID]);

  const fetchProfile = async (fetchID) => {
    const data = await findStudent(fetchID).finally(() => {
      setLoading(false);
    });

    if (data) {
      const mentorship = await findMentor(fetchID, dispatch);
      const details = await viewStudentDetails(fetchID);
      if (data && mentorship && details) {
        const studentData = {
          profile: data,
          mentorship,
          details,
        };
        setStudent(studentData);
        setOriginalStudent(studentData);
        console.log(JSON.stringify(studentData));
        console.log(studentData.profile?.isMentorShipCompleted);
      }
    }
  };

  const handleDataChange = (section, key, value) => {
    setModifiedKeys((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setStudent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const saveChanges = () => {
    const isChanged = _.isEqual(student, originalStudent);
    if (isChanged) {
      alertModal({
        toastIcon: "warning",
        toastTitle: "Herhangi bir değişiklik yapmadınız.",
      });
      return;
    } else {
      updateModified(modifiedKeys, searchID).finally(() => {
        setStudent(originalStudent);
        setModifiedKeys({});
      });
    }
  };

  const handleSearch = () => {
    const searchedID = searchRef.current.value;
    if (searchedID !== "") {
      setSearchID(searchedID);
    }
  };

  if (searchID === "") {
    return (
      <>
        <div className="w-full h-auto items-center justify-between flex flex-row ">
          <Input
            className="dark w-1/2 appearance-none"
            variant="bordered"
            label="Öğrenci ID"
            ref={searchRef}
            color="warning"
            aria-controls="false"
            inputMode="numeric"
            errorMessage={
              "ID numarası 7 karakter ve sadece sayılardan oluşur. Lütfen kontrol edin "
            }
            pattern="[0-9]*"
            maxLength={7}
            classNames={{
              input: "text-warning-500 font-bold",
              inputWrapper: "text-warning-500 font-bold",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !/^[0-9]+$/.test(e.key)) handleSearch();
            }}
            startContent={<span className=" text-sm text-warning-500">#</span>}
          />
          <div className="w-1/3 h-auto items-center justify-end flex flex-row gap-2">
            <Button
              className="w-1/2 dark"
              size="lg"
              color="warning"
              variant="flat"
              onPress={handleSearch}
              startContent={<SearchIcon />}
            >
              Ara
            </Button>
          </div>
        </div>
        <Error
          style={"mt-16"}
          errorNote={"Lütfen Düzenleme Yapmak İçin Öğrenci ID girin"}
          header={"Öğrenci ID girin"}
        />
      </>
    );
  }
  return (
    <div className="w-full h-auto  p-6 bg-transparent">
      <div className="w-full h-auto items-center justify-between flex lg:flex-row flex-col">
        <Input
          className="dark lg:w-1/2 w-full appearance-none"
          variant="bordered"
          label="Öğrenci ID"
          ref={searchRef}
          color="warning"
          aria-controls="false"
          inputMode="numeric"
          errorMessage={
            "ID numarası 7 karakter ve sadece sayılardan oluşur. Lütfen kontrol edin "
          }
          pattern="[0-9]*"
          maxLength={7}
          classNames={{
            input: "text-warning-500 font-bold",
            inputWrapper: "text-warning-500 font-bold",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !/^[0-9]+$/.test(e.key)) handleSearch();
          }}
          startContent={<span className=" text-sm text-warning-500">#</span>}
        />
        <div className="lg:w-1/3 w-full h-auto items-center justify-end flex flex-row gap-1 ">
          <Button
            className="w-full  dark"
            size="lg"
            color="warning"
            variant="flat"
            onPress={handleSearch}
            startContent={<SearchIcon />}
          >
            {"Ara"}
          </Button>
          <Button
            className="w-full  dark"
            size="lg"
            color="success"
            variant="flat"
            onPress={saveChanges}
            startContent={<BiSave className="w-6 h-6" />}
          >
            {"Kaydet"}
          </Button>
        </div>
      </div>
      <div className="w-full h-auto  bg-transparent lg:mt-4 mt-8 items-center justify-start flex lg:flex-row flex-col gap-2">
        <div
          className={`lg:w-1/2 w-full self-start lg:h-[525px] h-[600px] ${
            !loading && "border-slate-600 border"
          }  rounded-xl p-4 relative`}
        >
          {loading ? (
            <LoadingSkeleton
              isWidthFull
              mode={"card"}
              repeat={1}
              textLine={3}
            />
          ) : (
            <>
              <AvatarForm
                id={id}
                email={student.profile?.email}
                name={student.profile?.name}
                phone={student.profile?.phone}
                src={student.profile?.avatar}
              />
              <hr className="mt-2 mb-4 border-slate-600" />
              <div className="w-full h-auto  items-center justify-center flex flex-col">
                <div className="items-center justify-center flex lg:flex-row flex-col gap-2 w-full">
                  <Input
                    type="text"
                    label="Adres"
                    className="dark"
                    readOnly
                    value={student.profile?.address}
                    variant="bordered"
                  />
                  <Input
                    type="text"
                    label="Yaş"
                    variant="bordered"
                    className="dark"
                    readOnly
                    value={student.profile?.age}
                  />
                  <Input
                    readOnly
                    type="text"
                    variant="bordered"
                    label="Şehir"
                    className="dark"
                    value={student.profile?.city}
                  />
                </div>
                <div className="items-center justify-center flex flex-row gap-2 mt-2 w-full">
                  <Input
                    readOnly
                    type="text"
                    label="Kayıt Tarihi"
                    variant="bordered"
                    className="dark w-1/2"
                    value={student.profile.created_at?.slice(0, 10)}
                  />
                  <Input
                    readOnly
                    type="text"
                    label="Kayıt Durumu"
                    className="dark w-1/2"
                    color={colorSet(student.profile?.status)}
                    value={valueSet(student.profile?.status)}
                  />
                </div>
                <div className="items-center justify-center flex flex-row gap-2 mt-2 w-full">
                  <Input
                    readOnly
                    type="text"
                    variant="bordered"
                    label="Üniversite"
                    className="dark"
                    value={student.profile?.university}
                  />
                  <Input
                    readOnly
                    type="text"
                    label="Sömestr"
                    className="dark"
                    variant="bordered"
                    value={student.profile?.university_semester}
                  />
                </div>
                <div className="items-center justify-center flex flex-row gap-2 mt-2 w-full">
                  {/* <BoolInput
                    onChange={(value) =>
                      handleDataChange(
                        "profile",
                        "isMentorShipCompleted",
                        value
                      )
                    }
                    label={"isMentorShipCompleted"}
                    val={student?.profile?.isMentorShipCompleted}
                  /> */}
                  <BoolInput
                    onChange={(value) =>
                      handleDataChange("profile", "isTrcCompleted", value)
                    }
                    key={"isTrcCompleted"}
                    label={"isTrcCompleted"}
                    val={JSON.stringify(student?.profile?.isTrcCompleted)}
                  />
                </div>
                <div className="items-center justify-center flex flex-row gap-2 mt-2 w-full">
                  {/* <BoolInput
                    onChange={(value) =>
                      handleDataChange(
                        "profile",
                        "isUniversityRegistrationProcessCompleted",
                        value
                      )
                    }
                    label={"isUniversityRegistrationProcessCompleted"}
                    val={
                      student.profile?.isUniversityRegistrationProcessCompleted
                    }
                  />
                  <BoolInput
                    onChange={(value) =>
                      handleDataChange("profile", "isVisaCompleted", value)
                    }
                    label={"isVisaCompleted"}
                    val={student.profile?.isVisaCompleted}
                  /> */}
                </div>
                <div className="w-full h-auto items-center justify-center flex flex-row gap-2 mt-3 absolute bottom-4 px-4">
                  <Button
                    color="success"
                    variant="flat"
                    className="dark w-1/2"
                    size="lg"
                    onPress={() => {
                      setMode(INITIAL_MODE_VALUE);
                      dispatch(
                        setDocumentSetting({
                          action: "view",
                        })
                      );
                    }}
                    startContent={<EyeIcon />}
                  >
                    Görüntüle
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    className="dark w-1/2"
                    size="lg"
                    onPress={() => {
                      setMode("edit");
                      dispatch(
                        setDocumentSetting({
                          action: "edit",
                        })
                      );
                    }}
                    startContent={<EditIcon />}
                  >
                    Editle
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={`lg:w-1/2 w-full h-[525px] self-start max-h-full overflow-y-scroll ${
            !loading && "border-slate-600 border"
          } rounded-xl lg:p-8 p-4`}
        >
          {loading ? (
            <LoadingSkeleton
              isWidthFull
              mode={"label"}
              repeat={7}
              textLine={3}
            />
          ) : (
            <>
              <h2 className="font-extrabold text-2xl  tracking-tight">
                Mentör Bilgileri
              </h2>
              <div className="w-full h-auto items-center justify-center flex flex-wrap gap-2 py-4">
                {Object.entries(student.mentorship)?.map(([key, val], idx) => {
                  const isBool = key.startsWith("is");
                  if (isBool) {
                    return (
                      <BoolInput
                        onChange={(value) =>
                          handleDataChange("mentorship", key, value)
                        }
                        label={key}
                        val={val}
                        key={idx}
                      />
                    );
                  } else {
                    return (
                      <TextInput
                        onChange={(value) =>
                          handleDataChange("mentorship", key, value)
                        }
                        label={key}
                        val={val}
                        key={idx}
                      />
                    );
                  }
                })}
              </div>
              <h2 className="font-extrabold text-2xl self-start tracking-tight pt-4">
                Öğrenci Detayları
              </h2>
              <div className="w-full h-auto items-center justify-center flex flex-wrap gap-2 py-4">
                {Object.entries(student.details)?.map(([key, val], idx) => {
                  const isBool = key.startsWith("is");
                  if (isBool) {
                    return (
                      <BoolInput
                        onChange={(value) =>
                          handleDataChange("details", key, value)
                        }
                        label={key}
                        val={val}
                        key={idx}
                      />
                    );
                  } else {
                    return (
                      <TextInput
                        onChange={(value) =>
                          handleDataChange("details", key, value)
                        }
                        label={key}
                        val={val}
                        key={idx}
                      />
                    );
                  }
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
