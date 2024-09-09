import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  Button,
  Image,
  Input,
  Card,
  CardHeader,
  CardFooter,
} from "@nextui-org/react";
import addEvent from "@/utils/db/adminQueries/events/addEvent";
import alertModal from "@/utils/assistants/alertModal";
import idGenerator from "@/utils/assistants/idGenerator";
import { getDate } from "@/utils/assistants/getDate";

const font = Inter({
  subsets: ["latin"],
});

const INITIAL_EVENT_OBJ = {
  header: "Etkinlik Başlığı",
  subHeader: "Etkinlik Alt Başlığı",
  imgSrc: "https://olymposedu.com/edu-logo.png",
  btnText: "Buton Adi",
  iconImg: "/edu-logo.png",
  link: "https://olymposedu.com/",
  p1: "Metin 1",
  p2: "Metin 2",
};

const inputErrMsg = "Lütfen bu alanı doldurun.";
const NECESSARY_INPUTS = ["header", "subHeader"];

export const MediumCardEventGenerator = () => {
  const [ev, setEv] = useState(INITIAL_EVENT_OBJ);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ev.imgSrc === "") {
      setEv((prev) => ({
        ...prev,
        imgSrc: "https://olymposedu.com/edu-logo.png",
      }));
    }
  }, []);

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
        eventType: "medium",
        header: ev.header,
        subHeader: ev.subHeader,
        imgSrc: ev?.imgSrc,
        btnText: ev?.btnText,
        link: ev?.link,
        p1: ev?.p1,
        p2: ev?.p2,
      };
      await addEvent(newEvent).finally(() => setLoading(false));
      setEv(INITIAL_EVENT_OBJ);
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
      <Card
        isFooterBlurred
        className="w-2/6 h-[360px] col-span-12 sm:col-span-7 self-center bg-slate-950/50"
      >
        <CardHeader className="absolute z-10 top-4 left-4 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            {ev.header}
          </p>
          <h4 className="text-white/90 font-medium text-xl">{ev.subHeader}</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src={ev.imgSrc}
        />
        {!(ev.p1 === "" && ev.p2 === "" && ev.btnText === "") && (
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              {ev.iconImg !== "" && (
                <Image
                  alt="Breathing app icon"
                  loading="eager"
                  className="rounded-full w-10 h-10 bg-white"
                  src={ev.iconImg}
                />
              )}

              <div className="flex flex-col">
                <p className="text-tiny text-white/60">{ev.p1}</p>
                <p className="text-tiny text-white/60">{ev.p2}</p>
              </div>
            </div>
            {ev.btnText !== "" && (
              <Button
                className={`dark text-tiny ${
                  ev.p1 === "" && ev.p2 === "" && "w-full"
                }`}
                color={ev.p1 === "" && ev.p2 === "" ? "success" : "primary"}
                radius={ev.p1 === "" && ev.p2 === "" ? "sm" : "full"}
                variant={ev.p1 === "" && ev.p2 === "" ? "flat" : "solid"}
                size="sm"
              >
                <a
                  href={ev.link}
                  target="_blank"
                  rel="norefferer"
                  className="w-full h-full items-center justify-center flex"
                >
                  {ev.btnText}
                </a>
              </Button>
            )}
          </CardFooter>
        )}
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
        <div className="items-center justify-start flex flex-row gap-2 mb-2">
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.p1}
            isClearable
            onClear={() => handleClearInput("p1")}
            label="Metin 1"
            className="w-full dark"
            onChange={(e) => handleChange(e, "p1")}
          />
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.p2}
            isClearable
            onClear={() => handleClearInput("p2")}
            label="Metin 2"
            className="w-full dark"
            onChange={(e) => handleChange(e, "p2")}
          />
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.iconImg}
            isClearable
            onClear={() => handleClearInput("iconImg")}
            label="Icon Görseli"
            className="w-full dark"
            onChange={(e) => handleChange(e, "iconImg")}
          />
        </div>
        <Input
          type="text"
          variant="bordered"
          color="default"
          description="Görsel bağlantı linkini buraya yapıştırın. Görseliniz yoksa bu alanı boş bırakın"
          value={ev?.imgSrc}
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
            isClearable
            onClear={() => handleClearInput("btnText")}
            label="Buton Adı"
            className="w-full dark"
            onChange={(e) => handleChange(e, "btnText")}
          />
          {ev?.btnText !== "" && (
            <Input
              type="text"
              variant="bordered"
              isRequired={ev?.link === "" && ev?.btnText !== ""}
              errorMessage={inputErrMsg}
              color="default"
              value={ev?.link}
              isClearable
              onClear={() => handleClearInput("link")}
              label="Buton Linki"
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
