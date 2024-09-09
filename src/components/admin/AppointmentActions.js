import { parseDate } from "@internationalized/date";
import { Calendar } from "@nextui-org/calendar";
import { Button, TimeInput } from "@nextui-org/react";
import { useMemo, useState } from "react";
import alertModal from "@/utils/assistants/alertModal";
import findStudent from "@/utils/db/adminQueries/findStudent";
import { CiWarning } from "react-icons/ci";
import { useSelector } from "react-redux";
import addAppointment from "@/utils/db/adminQueries/addAppointment";
import idGenerator from "@/utils/assistants/idGenerator";

export const AppointmentActions = () => {
  const { email } = useSelector((state) => state.login);
  const [isErrorLog, setIsErrorLog] = useState({
    errHour: null,
    errDesc: null,
    errStudentId: null,
    errLinkId: null,
    errDate: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    desc: "",
    hour: "",
    link: "",
    student_id: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  let [date, setDate] = useState(parseDate("2024-06-03"));

  const generatedId = useMemo(
    () => idGenerator(12, "number"),
    [newAppointment.student_id]
  );
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setNewAppointment((prev) => ({
      ...prev,
      date: newDate.toString(),
    }));
  };

  const handleTimeChange = (time) => {
    if (time && time.hour !== undefined && time.minute !== undefined) {
      const formattedTime = `${time.hour}.${time.minute}`;
      setNewAppointment((prev) => ({
        ...prev,
        hour: formattedTime,
      }));
    } else {
      alertModal({
        toastIcon: "error",
        toastTitle: `Geçersiz zaman objesi ${time}`,
      });
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setNewAppointment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      newAppointment.date === "" ||
      newAppointment.date === null ||
      newAppointment.date === "2024-06-03"
    ) {
      alertModal({
        toastIcon: "warning",
        toastTitle: "Tarihte herhangi bir değişiklik yapmadınız.",
      });
      setErrorMsg("Tarihte herhangi bir değişiklik yapmadınız");
      setIsErrorLog((prev) => ({
        ...prev,
        errDate: true,
      }));
    } else {
      if (newAppointment.desc === "") {
        alertModal({
          toastIcon: "warning",
          toastTitle: "Açıklama doldurulmalıdır.",
        });
        setErrorMsg("Açıklama doldurulmalıdır.");
        setIsErrorLog((prev) => ({
          ...prev,
          errDate: null,
          errDesc: true,
        }));
      } else {
        if (
          newAppointment.hour === null ||
          newAppointment.hour === "" ||
          newAppointment.hour === undefined
        ) {
          alertModal({
            toastIcon: "warning",
            toastTitle: "Randevu saati zorunludur.",
          });
          setErrorMsg("Randevu saati zorunludur.");
          setIsErrorLog((prev) => ({
            ...prev,
            errDesc: null,
            errHour: true,
          }));
        } else {
          if (newAppointment.link === "") {
            alertModal({
              toastIcon: "warning",
              toastTitle: "Link veya adres zorunludur.",
            });
            setErrorMsg("Link veya adres zorunludur.");
            setIsErrorLog((prev) => ({
              ...prev,
              errHour: null,
              errLinkId: true,
            }));
          } else {
            if (newAppointment.student_id === "") {
              alertModal({
                toastIcon: "warning",
                toastTitle: "Öğrencinin ID'sinin girilmesi zorunludur.",
              });
              setErrorMsg("Öğrencinin ID'sinin girilmesi zorunludur.");
              setIsErrorLog((prev) => ({
                ...prev,
                errLinkId: null,
                errStudentId: true,
              }));
            } else {
              const checkStudent = async () => {
                setLoading(true);
                const check = await findStudent(
                  newAppointment?.student_id
                ).finally(() => {
                  setLoading(false);
                });
                if (check) {
                  setLoading(true);
                  const createAppointment = await addAppointment(
                    newAppointment,
                    email,
                    generatedId
                  ).finally(() => {
                    setLoading(false);
                  });

                  if (createAppointment) {
                    alertModal({
                      toastIcon: "success",
                      toastTitle: "Randevu başarıyla oluşturuldu!",
                    });
                    setDate(parseDate("2024-06-03"));
                    setNewAppointment({
                      date: "",
                      desc: "",
                      hour: "",
                      link: "",
                      student_id: "",
                    });
                    setErrorMsg("");
                    setIsErrorLog({
                      errDate: null,
                      errDesc: null,
                      errHour: null,
                      errLinkId: null,
                      errStudentId: null,
                    });
                  }
                } else {
                  alertModal({
                    toastIcon: "error",
                    toastTitle: "Öğrenci bulunamadı, randevu oluşturulamadı.",
                  });
                }
              };
              checkStudent();
            }
          }
        }
      }
    }
  };

  return (
    <>
      <Calendar
        aria-label="Date"
        title="LIST"
        className="dark self-center "
        value={date}
        onChange={handleDateChange}
      />

      <div className={`lg:w-4/5 w-full px-2 h-auto flex flex-col gap-3`}>
        <h2 className="pt-4 text-lg font-bold tracking-tight text-white">
          Randevu Oluştur
        </h2>
        <TimeInput
          label="Randevu Saati"
          className="dark"
          onChange={handleTimeChange}
          errorMessage={"Lütfen saat belirleyin."}
          isInvalid={isErrorLog.errHour === false}
          color={isErrorLog.errHour === false ? "warning" : "default"}
        />
        <label
          htmlFor={"desc"}
          className={`h-auto w-full relative block overflow-hidden rounded-md border-gray-200 border px-3 pt-3 shadow-sm focus-within:border-slate-600 cursor-pointer focus-within:ring-1 focus-within:ring-slate-600`}
        >
          <input
            type={"text"}
            id={"desc"}
            maxLength={240}
            value={newAppointment.desc}
            placeholder={"Calendar"}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm font-bold"
            onChange={handleInputChange}
          />
          <span className="absolute capitalize start-3 top-3 -translate-y-1/2 text-xs text-white/50 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
            Randevu Adı
          </span>
        </label>
        <label
          htmlFor={"student_id"}
          className={`h-auto w-full relative block overflow-hidden rounded-md border-gray-200 border px-3 pt-3 shadow-sm focus-within:border-slate-600 cursor-pointer focus-within:ring-1 focus-within:ring-slate-600`}
        >
          <input
            type={"text"}
            id={"student_id"}
            aria-controls="false"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={7}
            value={newAppointment.student_id}
            placeholder={"Calendar"}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm font-semibold"
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key !== "Backspace" && !/^[0-9]+$/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
          <span className="absolute capitalize start-3 top-3 -translate-y-1/2 text-xs text-white/50 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
            Öğrenci ID
          </span>
        </label>
        <label
          htmlFor={"link"}
          className={`h-auto w-full relative block overflow-hidden rounded-md border-gray-200 border px-3 pt-3 shadow-sm focus-within:border-slate-600 cursor-pointer focus-within:ring-1 focus-within:ring-slate-600`}
        >
          <input
            type={"text"}
            id={"link"}
            value={newAppointment.link}
            aria-controls="false"
            placeholder={"Toplantı Linki Ya Da Adresi"}
            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm font-semibold"
            onChange={handleInputChange}
          />
          <span className="absolute capitalize start-3 top-3 -translate-y-1/2 text-xs text-white/50 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ">
            Toplantı Linkini ya da adresini girin
          </span>
        </label>

        <Button
          color="success"
          variant="ghost"
          disabled={loading}
          className="dark w-full h-auto py-2 px-4 tracking-tighter rounded-lg font-semibold text-success-500 hover:text-white"
          onClick={handleSubmit}
        >
          {loading ? "Yükleniyor..." : "Randevu Kaydet"}
        </Button>
        {Object.values(isErrorLog)?.some((val) => val === null) &&
          errorMsg !== "" && (
            <p className="items-center justify-start flex flex-row gap-1 text-warning-400 text-small py-[1px]">
              <CiWarning className="w-5 h-5" />
              <span>{errorMsg}</span>
            </p>
          )}
      </div>
    </>
  );
};
