import viewEvents from "@/utils/db/viewEvents";
import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  CardBody,
  Button,
  Chip,
  Input,
  Textarea,
} from "@nextui-org/react";
import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import { CgInfo } from "react-icons/cg";
import _ from "lodash";
import alertModal from "@/utils/assistants/alertModal";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import deleteEvent from "@/utils/db/adminQueries/events/deleteEvent";

const errMessage = "Lütfen bu kısmı doldurun.";

export const EventEditor = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const scrollCardRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await viewEvents().finally(() => setLoading(false));
      setAllEvents(events);
    };
    if (allEvents.length <= 0) fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventID) {
      const findEvent = allEvents.find((e) => e.id === selectedEventID);
      setSelectedEvent(findEvent);
    }
  }, [selectedEventID]);

  const handleSave = async () => {
    const findEvent = allEvents.find((e) => e.id === selectedEventID);
    const isEqual = _.isEqual(selectedEvent, findEvent);

    if (!isEqual) {
      const saveChanges = allEvents.map((e) =>
        e.eventID === selectedEventID ? selectedEvent : e
      );
      setAllEvents(saveChanges);
    } else {
      alertModal({
        toastIcon: "error",
        toastTitle:
          "Herhangi bir değişiklik yapmadınız. Etkinlik(ler) Güncellenemedi.",
      });
    }
  };

  const handleScrollToCard = (eventID) => {
    const { current } = sectionRef;
    setSelectedEventID(eventID);
    current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDelete = () => {
    if (selectedEventID) {
      const updatedEvents = allEvents?.filter(
        (e) => e.eventID !== selectedEventID
      );
      setAllEvents(updatedEvents);
      setSelectedEventID(null);
      setSelectedEvent(null);
    }
  };

  const handleChanges = (e, val) =>
    setSelectedEvent((prev) => ({
      ...prev,
      [val]: e.target.value,
    }));

  const handleClear = (val) =>
    setSelectedEvent((prev) => ({
      ...prev,
      [val]: "",
    }));

  const handleRemoveEvent = async () => {
    setLoading(true);
    const delEv = await deleteEvent(selectedEventID).finally(() =>
      setLoading(false)
    );

    if (delEv) {
      const newEvents = allEvents.filter((ev) => ev.id !== selectedEventID);
      setAllEvents(newEvents);
      setSelectedEventID(null);
      setSelectedEvent(null);
      alertModal({
        toastIcon: "success",
        toastTitle: "Etkinlik silindi.",
      });
    }
  };

  if (loading) {
    return (
      <section className="w-full h-full -mt-12 items-center justify-center flex flex-col">
        <div className="items-center justify-between flex flex-row w-full h-auto py-2 gap-2 text-white -skew-x-12">
          <h2 className="text-3xl tracking-tight font-extrabold">
            Güncel Etkinlikler
          </h2>
          <hr className="border-dashed border-white w-4/6" />
        </div>
        <div className="w-full h-[350px] mx-8 my-8 flex overflow-x-scroll gap-6 -skew-x-12 ">
          {Array.from({ length: 4 }).map((_, idx) => (
            <LoadingSkeleton isWidthFull mode={"half_card"} key={idx} />
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="w-full h-auto -mt-12" ref={scrollCardRef}>
      <div className="items-center justify-between flex flex-row w-full h-auto py-2 gap-2 text-white -skew-x-12">
        <h2 className="text-3xl tracking-tight font-extrabold">
          Güncel Etkinlikler
        </h2>
        <hr className="border-dashed border-white w-4/6" />
      </div>
      <div className="w-auto h-[350px] mx-8 my-8 flex overflow-x-scroll gap-6 -skew-x-12 ">
        {allEvents.length > 0 &&
          allEvents?.map((val, idx) => {
            switch (val.eventType) {
              case "card":
                return (
                  <Card
                    className="min-w-[300px] h-full relative items-center justify-center group overflow-hidden bg-black hover:scale-95  cursor-pointer"
                    key={idx}
                    onClick={() => {
                      handleScrollToCard(val.id);
                    }}
                  >
                    <button
                      className="absolute inset-0 bg-transparent z-50 w-full h-full opacity-0"
                      onClick={() => {
                        handleScrollToCard(val.id);
                      }}
                    ></button>
                    <Image
                      removeWrapper
                      alt="Card background"
                      className="z-0 w-full h-full object-cover absolute inset-0 opacity-75 transition-opacity group-hover:opacity-50 group-hover:backdrop-brightness-50 group-hover:backdrop-blur-md group-hover:transition-all group-hover:duration-200"
                      src={val.imgSrc}
                    />
                    <CardHeader className="absolute z-10 top-3 flex-col !items-start group-hover:transition-all transition-all group-hover:translate-x-4 duration-200">
                      <Chip
                        color="success"
                        startContent={
                          <IoIosNotifications className="text-white dark w-5 h-5" />
                        }
                      >
                        <p className="text-white uppercase">{val.header}</p>
                      </Chip>
                      <div className="group-hover:text-slate-200 text-slate-900 font-extrabold mt-1 w-auto text-lg">
                        <h4>{val.subHeader}</h4>
                      </div>
                    </CardHeader>
                    <CardBody className="relative rounded-xl">
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/50 backdrop-blur-md p-8 transform translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 rounded-xl">
                        <p className="text-sm text-white">{val.desc}</p>
                        <Button
                          color="primary"
                          variant="solid"
                          href={val.link}
                          target="_blank"
                          className="dark mt-2 z-50"
                        >
                          {val.btnText}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              case "medium":
                return (
                  <Card
                    isFooterBlurred
                    className="min-w-[300px] h-full hover:scale-95 cursor-pointer"
                  >
                    <button
                      className="absolute inset-0 bg-transparent z-50 w-full h-full opacity-0"
                      onClick={() => handleScrollToCard(val?.id)}
                    ></button>

                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                      <p className="text-tiny text-white/60 uppercase font-bold">
                        {val?.header}
                      </p>
                      <h4 className="text-white/90 font-medium text-xl">
                        {val?.subHeader}
                      </h4>
                    </CardHeader>
                    <Image
                      removeWrapper
                      loading="eager"
                      alt="Olymposedu Etkinlikler"
                      className="z-0 w-full h-full object-cover"
                      src={val?.imgSrc}
                    />
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                      <div className="flex flex-grow gap-2 items-center">
                        <Image
                          alt="Olymposedu Logo"
                          loading="eager"
                          className="rounded-full w-10 h-11 bg-white"
                          src={val?.iconImg}
                        />
                        <div className="flex flex-col">
                          <p className="text-tiny text-white/60">{val?.p1}</p>
                          <p className="text-tiny text-white/60">{val?.p2}</p>
                        </div>
                      </div>
                      <Button radius="full" size="sm">
                        <Link
                          target="_blank"
                          rel="norefferer"
                          href={val?.link || "#"}
                        >
                          {val?.btnText}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              case "ticket":
                return (
                  <button
                    className="flex transition hover:shadow-xl h-full min-w-[300px] bg-gray-900 shadow-gray-800/25 rounded-xl  cursor-pointer hover:scale-95 "
                    onClick={() => handleScrollToCard(val?.id)}
                  >
                    <div className="rotate-180 p-2 my-1 [writing-mode:_vertical-lr]">
                      <time
                        dateTime="2022-10-10"
                        className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-white"
                      >
                        <span>{val?.p1}</span>
                        <span className="w-px flex-1 bg-white/10"></span>
                        <span>{val?.p2}</span>
                      </time>
                    </div>
                    <div className="hidden sm:block sm:basis-56">
                      <Image
                        alt="alt"
                        width={500}
                        radius="none"
                        src={val?.imgSrc}
                        className="dark aspect-square h-full w-full object-cover ml-2 object-center "
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="border-s p-4 sm:!border-l-transparent sm:p-6 border-white/10">
                        <h3 className="font-bold uppercase  text-white">
                          {val?.subHeader}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm/relaxed  text-gray-200">
                          {val?.header}
                        </p>
                      </div>
                      {val?.btnText !== "" && (
                        <div className="sm:flex sm:items-end sm:justify-end">
                          <a
                            className="w-auto h-auto "
                            href={val?.link}
                            rel="norefferer"
                            target="_blank"
                          >
                            <Button
                              className=" dark block px-5 py-3 text-center text-xs font-bold uppercase rounded-br-xl  transition"
                              color="primary"
                              radius="none"
                              variant="flat"
                            >
                              {val?.btnText}
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </button>
                );

              case "small":
                return (
                  <Card
                    isFooterBlurred
                    className="min-w-[300px] h-full hover:scale-95  cursor-pointer"
                  >
                    <button
                      className="absolute inset-0 bg-transparent z-50 w-full h-full opacity-0"
                      onClick={() => handleScrollToCard(val?.id)}
                    ></button>
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                      <Chip
                        color="primary"
                        variant="solid"
                        className="dark text-tiny text-white uppercase font-bold"
                      >
                        {val?.header}
                      </Chip>
                      <h4 className="text-black font-medium text-2xl">
                        {val?.subHeader}
                      </h4>
                    </CardHeader>
                    <Image
                      removeWrapper
                      loading="eager"
                      alt="Card example background"
                      className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                      src={val?.imgSrc}
                    />
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                      <div>
                        <p className="text-black text-tiny">{val?.p1}</p>
                        <p className="text-black text-tiny">{val?.p2}</p>
                      </div>
                      <Button
                        className="text-tiny"
                        color="primary"
                        radius="full"
                        size="sm"
                      >
                        <Link
                          href={val?.link || "#"}
                          target="_blank"
                          rel="norefferer"
                        >
                          {val?.btnText}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              default:
                return;
            }
          })}
      </div>
      {!selectedEventID ? (
        <div className="items-center justify-between flex flex-row-reverse w-full h-auto py-2 gap-2  -skew-x-12">
          <h2 className="text-md tracking-tight font-extrabold text-white items-center justify-center flex flex-row gap-2">
            <CgInfo className="w-6 h-6" />
            Lütfen yukarıdan düzenlemek istediğiniz etkinliği seçin
          </h2>
          <hr className="border-dashed border-white w-7/12" />
        </div>
      ) : (
        <div ref={sectionRef} className="w-full h-auto items-start mt-16">
          <h2 className="text-white">
            <Chip color="success" variant="flat">
              {selectedEventID}
            </Chip>{" "}
            ID'li{" "}
            <Chip color="warning" variant="flat">
              {selectedEvent?.subHeader}
            </Chip>{" "}
            Adlı Etkinliği Düzenleyin
          </h2>
          <br />
          <aside className="w-full h-auto my-4 bg-transparent">
            <div className="items-center justify-start flex flex-row gap-2 mb-2">
              <Input
                type="text"
                variant="bordered"
                color="default"
                value={selectedEvent?.header}
                isRequired={selectedEvent?.header === ""}
                errorMessage={errMessage}
                isClearable
                onClear={() => handleClear("header")}
                label="Başlık"
                className="w-full dark"
                onChange={(e) => handleChanges(e, "header")}
              />
              <Input
                type="text"
                variant="bordered"
                color="default"
                value={selectedEvent?.subHeader}
                isRequired={selectedEvent?.subHeader === ""}
                errorMessage={errMessage}
                isClearable
                onClear={() => handleClear("subHeader")}
                label="Alt Başlık"
                className="w-full dark"
                onChange={(e) => handleChanges(e, "subHeader")}
              />
            </div>
            <Textarea
              type="text"
              isRequired={selectedEvent?.desc === ""}
              errorMessage={errMessage}
              variant="bordered"
              label="Etkinlik Açıklaması"
              className="dark w-full"
              value={selectedEvent?.desc}
              onChange={(e) => handleChanges(e, "desc")}
            />
            <Input
              type="text"
              variant="bordered"
              color="default"
              value={selectedEvent?.imgSrc}
              isRequired={selectedEvent?.imgSrc === ""}
              errorMessage={errMessage}
              description="Görsel bağlantı linkini buraya yapıştırın. Görseliniz yoksa bu alanı boş bırakın"
              isClearable
              onClear={() => handleClear("imgSrc")}
              label="Görsel"
              className="w-full dark"
              onChange={(e) => handleChanges(e, "imgSrc")}
            />
            <div className="items-start justify-start w-full h-auto flex flex-row gap-2 mt-2">
              <Input
                type="text"
                isClearable
                isRequired={selectedEvent?.btnText === ""}
                errorMessage={errMessage}
                variant="bordered"
                label="Buton Adı"
                className="dark w-full"
                value={selectedEvent?.btnText}
                onClear={() => handleClear("btnText")}
                onChange={(e) => handleChanges(e, "btnText")}
              />
              {selectedEvent?.btnText !== "" && (
                <Input
                  type="text"
                  isClearable
                  isRequired={selectedEvent?.link === ""}
                  errorMessage={errMessage}
                  variant="bordered"
                  label="Buton Yönlendirme Linki"
                  className="dark w-full"
                  value={selectedEvent?.link}
                  onClear={() => handleClear("link")}
                  onChange={(e) => handleChanges(e, "link")}
                />
              )}
            </div>
            <div className="justify-start items-center flex flex-row gap-2 w-auto h-auto mt-4">
              <Button
                color="success"
                variant="flat"
                className="dark"
                size="lg"
                onPress={handleSave}
              >
                Etkinliği Kaydet
              </Button>
              <Button
                color="warning"
                variant="flat"
                className="dark"
                size="lg"
                onPress={handleDelete}
              >
                Değişiklikleri Sil
              </Button>
              <Button
                color="danger"
                variant="flat"
                className="dark"
                size="lg"
                onPress={handleRemoveEvent}
              >
                Etkinliği Kaldır
              </Button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
