import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Button, Image, Input, Textarea } from "@nextui-org/react";

const font = Inter({
  subsets: ["latin"],
});

const INITIAL_EVENT_OBJ = {
  header: "Etkinlik Başlığı Buraya Gelecek",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque dignissimos. Molestias explicabo corporis voluptatem?",
  imgSrc: "https://olymposedu.com/edu-logo.png",
  btnText: "Buton Adi",
  link: "https://olymposedu.com/",
  verticalTxt1: "HAZ 10",
  verticalTxt2: "2024",
};

const inputErrMsg = "Lütfen bu alanı doldurun.";
export const TicketEventGenerator = () => {
  const [ev, setEv] = useState(INITIAL_EVENT_OBJ);

  useEffect(() => {
    if (ev?.imgSrc === "")
      setEv((prev) => ({
        ...prev,
        imgSrc: "https://olymposedu.com/edu-logo.png",
      }));
  }, [ev.imgSrc]);

  const handleDelete = () => setEv(INITIAL_EVENT_OBJ);
  const handleSubmit = async () => {};

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
      className={`h-auto w-auto items-start justify-start text-start flex flex-col gap-8 ${font.className} -mt-4`}
    >
      <article className="flex transition hover:shadow-xl bg-gray-900 shadow-gray-800/25 rounded-xl">
        <div className="rotate-180 p-2 my-1 [writing-mode:_vertical-lr]">
          <time
            dateTime="2022-10-10"
            className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-white"
          >
            <span>{ev?.verticalTxt2}</span>
            <span className="w-px flex-1 bg-white/10"></span>
            <span>{ev?.verticalTxt1}</span>
          </time>
        </div>
        <div className="hidden sm:block sm:basis-56">
          <Image
            alt="Event Image"
            width={500}
            radius="none"
            src={ev?.imgSrc}
            className="dark aspect-square h-full w-full object-cover ml-2 object-center "
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="border-s p-4 sm:!border-l-transparent sm:p-6 border-white/10">
            <h3 className="font-bold uppercase  text-white">{ev?.header}</h3>
            <p className="mt-2 line-clamp-3 text-sm/relaxed  text-gray-200">
              {ev?.desc}
            </p>
          </div>
          {ev?.btnText !== "" && (
            <div className="sm:flex sm:items-end sm:justify-end">
              <a
                className="w-auto h-auto "
                href={ev?.link}
                rel="norefferer nopeener"
                target="_blank"
              >
                <Button
                  className=" dark block px-5 py-3 text-center text-xs font-bold uppercase rounded-br-xl  transition"
                  color="primary"
                  radius="none"
                  variant="flat"
                >
                  {ev?.btnText}
                </Button>
              </a>
            </div>
          )}
        </div>
      </article>
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
            value={ev?.btnText}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("btnText")}
            label="Buton adı"
            className="w-full dark"
            onChange={(e) => handleChange(e, "btnText")}
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
          label="Buton adı"
          className="w-full dark"
          onChange={(e) => handleChange(e, "imgSrc")}
        />
        <div className="items-center justify-start flex flex-row gap-2 mb-2">
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.verticalTxt1}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("verticalTxt1")}
            label="Etiket Yazısı 1"
            className="w-full dark"
            onChange={(e) => handleChange(e, "verticalTxt1")}
          />
          <Input
            type="text"
            variant="bordered"
            color="default"
            value={ev?.verticalTxt2}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("verticalTxt2")}
            label="Etiket Yazısı 2"
            className="w-full dark"
            onChange={(e) => handleChange(e, "verticalTxt2")}
          />
        </div>
        {ev.btnText !== "" && (
          <Input
            type="text"
            variant="bordered"
            isRequired={ev?.link === ""}
            color="default"
            value={ev?.link}
            errorMessage={inputErrMsg}
            isClearable
            onClear={() => handleClearInput("link")}
            label="Buton Yönlendirme Linki"
            className="w-full dark"
            onChange={(e) => handleChange(e, "link")}
          />
        )}
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
3;
