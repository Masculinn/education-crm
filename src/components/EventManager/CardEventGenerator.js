import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  Button,
  Image,
  Input,
  Textarea,
  link,
  Card,
  CardHeader,
  Chip,
  CardBody,
} from "@nextui-org/react";
import { IoIosNotifications } from "react-icons/io";
import alertModal from "@/utils/assistants/alertModal";
import updateEvent from "@/utils/db/adminQueries/events/updateEvent";
import addEvent from "@/utils/db/adminQueries/events/addEvent";
import idGenerator from "@/utils/assistants/idGenerator";
import { getDate } from "@/utils/assistants/getDate";

const font = Inter({
  subsets: ["latin"],
});

const NECESSARY_INPUTS = ["header", "subHeader", "desc"];
const INITIAL_EVENT_OBJ = {
  header: "Etkinlik Başlığı",
  subHeader: "Etkinlik Alt Başlığı",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus",
  imgSrc: "https://olymposedu.com/edu-logo.png",
  btnText: "Buton Adi",
  link: "https://olymposedu.com/",
};
const inputErrMsg = "Lütfen bu alanı doldurun.";

export const CardEventGenerator = () => {
  const [ev, setEv] = useState(INITIAL_EVENT_OBJ);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ev.imgSrc === "") {
      setEv((prev) => ({
        ...prev,
        imgSrc: "https://olymposedu.com/edu-logo.png",
      }));
    }
  }, [ev.imgSrc]);

  const handleDelete = () => setEv(INITIAL_EVENT_OBJ);
  const handleSubmit = async () => {
    if (NECESSARY_INPUTS.some((input) => ev[input] === "")) {
      alertModal({
        toastIcon: "error",
        toastTitle: "Lütfen zorunlu yerleri doldurun.",
      });
      return;
    } else {
      setLoading(true);
      const newEvent = {
        id: idGenerator(7, "number"),
        created_at: getDate(),
        eventType: "card",
        header: ev?.header,
        subHeader: ev?.subHeader,
        desc: ev?.desc,
        imgSrc: ev?.imgSrc,
        btnText: ev?.btnText,
        link: ev?.link,
      };

      const data = await addEvent(newEvent).finally(() => setLoading(false));
      if (data) {
        alertModal({
          toastIcon: "success",
          toastTitle: "Etkinlik başarıyla eklendi eklendi.",
        });
        setEv(INITIAL_EVENT_OBJ);
      }
    }
  };

  const handleChange = (e, val) => {
    setEv((prev) => ({
      ...prev,
      [val]: e.target.value,
    }));
  };

  const handleClearInput = (val) => {
    setEv((prev) => ({
      ...prev,
      [val]: "",
    }));
  };

  return (
    <div
      className={`h-auto w-full items-start justify-start text-start flex flex-col gap-8 ${font.className} -mt-4`}
    >
      <Card className="group w-[440px] h-[360px] relative overflow-hidden self-center bg-black/50">
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover absolute inset-0 opacity-75 transition-opacity group-hover:opacity-50 group-hover:backdrop-brightness-50 group-hover:backdrop-blur-md group-hover:transition-all group-hover:duration-200"
          src={ev?.imgSrc}
        />
        <CardHeader className="absolute z-10 top-4   flex-col !items-start group-hover:transition-all transition-all group-hover:translate-x-4 duration-200">
          <Chip
            color="success"
            startContent={
              <IoIosNotifications className="text-white dark w-5 h-5 " />
            }
          >
            <p className="text-white uppercase">{ev?.header}</p>
          </Chip>
          <div className="group-hover:text-slate-200  text-slate-900 font-extrabold  mt-1 w-auto text-lg">
            <h4>{ev?.subHeader}</h4>
          </div>
        </CardHeader>
        <CardBody className="relative rounded-xl">
          <div className="absolute inset-x-0 bottom-0 bg-slate-900/50 backdrop-blur-md p-8  transform translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 rounded-xl">
            <p className="text-sm text-white">{ev?.desc}</p>
            {ev?.btnText !== "" && (
              <Button
                color="primary"
                variant="solid"
                target="_blank"
                className="dark mt-2 z-50"
              >
                <a
                  target="_blank"
                  href={ev?.link}
                  rel="norefferer"
                  className="w-full h-full items-center justify-center flex"
                >
                  {ev?.btnText}
                </a>
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
      <aside className="w-full h-auto my-4 bg-transparent">
        <div className="items-center justify-start flex flex-row gap-2 mb-2">
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.header}
            isRequired={ev?.header === ""}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("header")}
            label="Başlık"
            className="w-full dark"
            onChange={(e) => handleChange(e, "header")}
          />
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.subHeader}
            isRequired={ev?.subHeader === ""}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("subHeader")}
            label="Alt Başlık"
            className="w-full dark"
            onChange={(e) => handleChange(e, "subHeader")}
          />
        </div>
        <Textarea
          type="text"
          isRequired={ev?.desc === ""}
          errorMessage={inputErrMsg}
          variant="bordered"
          label="Açıklama"
          placeholder="Buraya yazın..."
          className="dark w-full"
          maxLength={325}
          value={ev?.desc}
          onChange={(e) => handleChange(e, "desc")}
        />
        <Input
          type="text"
          variant="bordered"
          color="default"
          value={ev?.imgSrc}
          description="Görsel bağlantı linkini buraya yapıştırın. Görseliniz yoksa bu alanı boş bırakın"
          errorMessage={inputErrMsg}
          isClearable
          onClear={() =>
            setEv((prev) => ({
              ...prev,
              imgSrc: "https://olymposedu.com/edu-logo.png",
            }))
          }
          label="Görsel"
          className="w-full dark"
          onChange={(e) => handleChange(e, "imgSrc")}
        />
        <div className="items-start justify-start w-full h-auto flex flex-row gap-2 mt-2">
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.btnText}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("btnText")}
            label="Buton Adı"
            className="w-full dark"
            onChange={(e) => handleChange(e, "btnText")}
          />
          {ev.btnText !== "" && (
            <Input
              type="text"
              variant="bordered"
              color="default"
              value={ev?.link}
              errorMessage={inputErrMsg}
              isClearable
              onClear={() => handleClearInput("link")}
              label="Buton yönlendirme linki"
              className="w-full dark"
              onChange={(e) => handleChange(e, "link")}
            />
          )}
        </div>
        <div className="justify-start items-center flex flex-row gap-2 w-auto h-auto mt-4">
          <Button
            color="success"
            variant="flat"
            className="dark"
            size="lg"
            onClick={handleSubmit}
          >
            Etkinliği Kaydet
          </Button>
          <Button
            color="danger"
            variant="flat"
            className="dark"
            size="lg"
            onClick={handleDelete}
          >
            Değişiklikleri Sil
          </Button>
        </div>
      </aside>
    </div>
  );
};
