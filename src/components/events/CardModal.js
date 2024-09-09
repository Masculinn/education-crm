import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  CardBody,
  Button,
  Chip,
} from "@nextui-org/react";
import { IoIosNotifications } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import viewEvents from "@/utils/db/viewEvents";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

export const CardModal = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardEvents, setCardEvents] = useState({});

  useEffect(() => {
    const viewAllEvents = async () => {
      setLoading(true);
      const allEvents = await viewEvents().finally(() => {
        setLoading(false);
      });
      setEvents(allEvents);
    };

    viewAllEvents();
  }, []);

  useMemo(() => {
    if (events) {
      const cards = events.filter((val) => val.eventType === "card");
      const mediums = events.filter((val) => val.eventType === "medium");
      const smallCardEvents = events.filter((val) => val.eventType === "small");
      setCardEvents({
        cardEvent: [...cards],
        mediumCardEvent: [...mediums],
        smallCardEvent: [...smallCardEvents],
      });
    }
  }, [events]);
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  if (loading) {
    return (
      <>
        <LoadingSkeleton isWidthFull h={"96"} mode={"card"} style={"mb-2"} />
        <div className="w-full h-auto items-center justify-center flex gap-2">
          <LoadingSkeleton isWidthFull h={"60"} mode={"half_card"} />
          <LoadingSkeleton isWidthFull h={"60"} mode={"half_card"} />
        </div>
      </>
    );
  } else {
    return (
      <div className={`max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 `}>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="col-span-12 relative sm:col-span-12 group w-full h-[360px]"
        >
          {cardEvents?.cardEvent?.map((val, idx) => (
            <SwiperSlide
              className="h-full w-full relative items-center justify-center group"
              key={idx}
            >
              <Card className="w-full h-full relative overflow-hidden bg-black">
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full object-cover absolute inset-0 opacity-75 transition-opacity group-hover:opacity-50 group-hover:backdrop-brightness-50 group-hover:backdrop-blur-md group-hover:transition-all group-hover:duration-200"
                  src={val?.imgSrc}
                />
                <CardHeader className="absolute z-10 top-3 flex-col !items-start group-hover:transition-all transition-all group-hover:translate-x-4 duration-200">
                  <Chip
                    color="success"
                    startContent={
                      <IoIosNotifications className="text-white dark w-5 h-5 " />
                    }
                  >
                    <p className="text-white uppercase">{val?.header}</p>
                  </Chip>
                  <div className="group-hover:text-slate-200 text-slate-900 font-extrabold mt-1 w-auto text-lg">
                    <h4>{val?.subHeader}</h4>
                  </div>
                </CardHeader>
                <CardBody className="relative rounded-xl">
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/50 backdrop-blur-md p-8 transform translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 rounded-xl">
                    <p className="text-sm text-white">{val?.desc}</p>
                    <Button
                      color="primary"
                      variant="solid"
                      href={val?.link || "#"}
                      target="_blank"
                      className="dark mt-2 z-50"
                    >
                      {val?.btnText}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
          <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
        {cardEvents?.smallCardEvent?.map((val, idx) => (
          <Card
            key={idx}
            isFooterBlurred
            className="w-full h-[360px] col-span-12 sm:col-span-5"
          >
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
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src={val?.imgSrc}
            />
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
              <div>
                <p className="text-black text-tiny"> {val?.p1}</p>
                <p className="text-black text-tiny"> {val?.p2}</p>
              </div>
              <Button
                className="text-tiny"
                color="primary"
                radius="full"
                size="sm"
              >
                <Link href={val?.link ?? "#"} target="_blank" rel="norefferer">
                  {val?.btnText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {cardEvents?.mediumCardEvent?.map((val, idx) => (
          <Card
            isFooterBlurred
            key={idx}
            className="w-full h-[360px] col-span-12 sm:col-span-7"
          >
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
                <Link href={val?.link || "#"} target="_blank" rel="norefferer">
                  {val?.btnText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};
