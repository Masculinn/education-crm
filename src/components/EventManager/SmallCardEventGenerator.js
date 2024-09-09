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

const font = Inter({
  subsets: ["latin"],
});

const INITIAL_EVENT_OBJ = {
  header: "Etkinlik Başlığı",
  subHeader: "Etkinlik Alt Başlığı",
  imgSrc: "https://olymposedu.com/edu-logo.png",
  btnText: "Buton Adı",
  link: "https://olymposedu.com/",
  p1: "Metin 1",
  p2: "Metin 2",
};

const inputErrMsg = "Lütfen bu alanı doldurun.";
const NECESSARY_INPUTS = ["header", "subHeader"];

export const SmallCardEventGenerator = () => {
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
        eventType: "small",
        header: ev?.header,
        subHeader: ev?.subHeader,
        imgSrc: ev?.imgSrc,
        btnText: ev?.btnText,
        link: ev?.link,
        p1: ev?.p1,
        p2: ev?.p2,
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
      <Card
        isFooterBlurred
        className="w-1/5 h-[360px] col-span-12 sm:col-span-5 self-center bg-black/50"
      >
        <CardHeader className="absolute z-10 top-4 left-2 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            {ev?.header}
          </p>
          <h4 className="text-white font-medium text-2xl">{ev?.subHeader}</h4>
        </CardHeader>
        <Image
          removeWrapper
          loading="eager"
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src={ev?.imgSrc}
        />
        {!(ev?.p1 === "" && ev?.p2 === "" && ev?.btnText === "") && (
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-white text-tiny">{ev?.p1}</p>
              <p className="text-white text-tiny">{ev?.p2}</p>
            </div>
            {ev?.btnText !== "" && (
              <Button
                className={`dark text-tiny ${
                  ev?.p1 === "" && ev?.p2 === "" && "w-full"
                }`}
                color={ev?.p1 === "" && ev?.p2 === "" ? "success" : "primary"}
                radius={ev?.p1 === "" && ev?.p2 === "" ? "sm" : "full"}
                variant={ev?.p1 === "" && ev?.p2 === "" ? "flat" : "solid"}
                size="sm"
              >
                <a
                  href={ev?.link}
                  target="_blank"
                  rel="norefferer"
                  className="w-full h-full items-center justify-center flex"
                >
                  {ev?.btnText}
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
