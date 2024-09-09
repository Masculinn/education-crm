import alertModal from "@/utils/assistants/alertModal";
import {
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { DM_Sans } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import { FaBookOpen, FaInfo } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { Reminder } from "../utils/Reminder";
import { Error } from "../utils/Error";
import { useSelector } from "react-redux";
import viewStudentSchoolNote from "@/utils/db/viewStudentSchoolNote";
import addStudentSchoolNote from "@/utils/db/addStudentSchoolNote";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

const font = DM_Sans({
  subsets: ["latin"],
});

export const MySchoolNotes = () => {
  const { id } = useSelector((state) => state.login);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState({
    header: "",
    date: "",
    note: "",
  });
  const [scrollKey, setScrollKey] = useState(0);
  const ref = useRef();
  const [reminderList, setReminderList] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const findSchoolNotes = async () => {
      const schoolNotes = await viewStudentSchoolNote(id).finally(() => {
        setLoading(false);
      });
      setReminderList(schoolNotes);
    };

    findSchoolNotes();
  }, [id]);

  const handleSubmit = () => {
    if (!Object.entries(reminder).some(([_, val]) => val === "")) {
      setError(false);
      setReminderList((prev) => [...prev, reminder]);
      alertModal({
        toastIcon: "success",
        toastTitle: "Hatırlatıcı Oluşturuldu!",
      });
      addStudentSchoolNote(reminder, id);
      setReminder({
        header: "",
        date: "",
        note: "",
      });

      setScrollKey((prev) => prev + 1);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (ref.current && scrollKey !== 0) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [reminderList, scrollKey]);
  return (
    <>
      <aside
        className={`w-full h-auto items-center justify-between flex lg:flex-row flex-col  gap-4 ${font.className}`}
      >
        {loading ? (
          <LoadingSkeleton style={"w-2/6"} mode={"card"} />
        ) : (
          <div className="lg:w-1/3 w-full bg-slate-900 h-full rounded-2xl items-start flex flex-col gap-4">
            <h2 className=" pt-4 text-2xl font-extrabold tracking-tighter mx-auto">
              Hatırlatıcı Oluştur
            </h2>
            <div className="w-4/5 h-auto items-center justify-start flex flex-col gap-1 mx-auto">
              <Input
                size="sm"
                type="text"
                color="default"
                isClearable
                errorMessage="Başlık Zorunludur"
                maxLength={48}
                isRequired
                className="dark w-full"
                variant="bordered"
                value={reminder.header}
                onChange={(e) => {
                  setReminder((prev) => ({
                    ...prev,
                    header: e.target.value,
                  }));
                }}
                onClear={() => {
                  setReminder((prev) => ({
                    ...prev,
                    header: "",
                  }));
                }}
                label={"Başlık"}
              />
              <Input
                size="sm"
                type="date"
                onClear={() => {
                  setReminder((prev) => ({
                    ...prev,
                    date: "",
                  }));
                }}
                isRequired
                errorMessage="Tarih Zorunludur"
                color="default"
                className="dark w-full"
                value={reminder.date}
                variant="bordered"
                label={"Tarih"}
                onChange={(e) => {
                  setReminder((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }));
                }}
              />
              <Textarea
                size="sm"
                color="default"
                isRequired
                errorMessage="Hatırlatıcı not zorunludur"
                value={reminder.note}
                className="dark w-full"
                variant="bordered"
                placeholder="Hatırlatıcı Notum..."
                maxLength={100}
                onChange={(e) => {
                  setReminder((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }));
                }}
              />
              {error && (
                <p className="w-full h-auto items-center justify-start flex -mt-2 mb-2 flex-row text-warning-500 gap-1 text-sm">
                  <IoIosWarning className="w-4 h-4" />
                  <span>Tüm alanlar doldurulmalıdır.</span>
                </p>
              )}
              <div className="w-full h-auto items-center justify-center flex flex-row-reverse gap-1 mb-4">
                <Button
                  color="success"
                  variant="flat"
                  size="md"
                  className="w-4/5 dark "
                  onPress={handleSubmit}
                >
                  Oluştur
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  size="md"
                  className="w-1/5 dark"
                  onClick={onOpen}
                  startContent={<FaInfo />}
                ></Button>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <LoadingSkeleton mode={"card"} style={"w-4/6"} />
        ) : (
          <div className="lg:w-2/3 w-full bg-slate-900 h-full rounded-2xl relative items-center justify-center flex px-4">
            <div
              className={`w-full h-[50vh] ${
                reminderList.length > 0
                  ? "items-start justify-start"
                  : "justify-center items-center"
              } flex rounded-2xl overflow-y-scroll flex-wrap py-4`}
            >
              {reminderList.length > 0 ? (
                reminderList.map((val, idx) => <Reminder key={idx} {...val} />)
              ) : (
                <Error errorNote={"Döküman Bulunamadı"} header={"Oops..."} />
              )}
              <div ref={ref}></div>
            </div>
          </div>
        )}
      </aside>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
        className={`dark text-slate-200 ${font.className}`}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        aria-label="Reminder Modal"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>
                <h2 className="text-rose-500 font-bold text-xl tracking-tighter items-center justify-center flex flex-row-reverse gap-2">
                  <span>Hatırlatıcı Rehberi</span>{" "}
                  <FaBookOpen className="w-5 h-5 " />
                </h2>
              </ModalHeader>
              <ModalBody>
                Hatırlatıcıyı kullanarak, önemli sınav tarihleri, proje
                tarihleri gibi önem arz eden planlamaları yapabilirsiniz.
                Hatırlatıcıya kaydedilen hatırlatıcılarınız, girdiğiniz tarih
                gelmeden; bu hesaba giriş yaptığınız mail kutunuza bildirim
                olarak gelecektir.
              </ModalBody>
              <ModalFooter>
                <Button
                  className="dark"
                  color="success"
                  variant="solid"
                  onPress={onclose}
                >
                  Anladım
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
