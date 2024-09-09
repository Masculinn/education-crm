import { useState, useEffect, useRef } from "react";
import { Chip, Divider, User } from "@nextui-org/react";
import { ConfirmedAnimation } from "../loading/ConfirmedAnimation";
import { ErrorAnimation } from "../icons/ErrorAnimation";
import { useTransition, animated, useSpringRef } from "@react-spring/web";
import { useDispatch, useSelector } from "react-redux";
import findMentor from "@/utils/db/findMentor";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

export const MyMentor = () => {
  const { id } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [mentor, setMentor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      const mentorData = await findMentor(id, dispatch).finally(() => {
        setLoading(false);
      });
      setMentor(mentorData);
    };

    fetchMentor();
  }, [id, dispatch]);

  const springRef = useSpringRef();

  useEffect(() => {
    if (isVisible && mentor) {
      springRef.start();
    }
  }, [isVisible, springRef, mentor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  const transitions = useTransition(
    Object.entries(mentor || {}).filter(([key, val]) => key.startsWith("is")),
    {
      ref: springRef,
      keys: (item) => item[0],
      from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
      enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
      leave: { opacity: 0, transform: "translate3d(0,-40px,0)" },
      config: { mass: 1, tension: 280, friction: 12 },
      trail: 200,
    }
  );

  const mentorStatus =
    mentor && Object.values(mentor)?.some((val) => val === false);

  return (
    <div
      className="w-full h-full items-start justify-center flex flex-col"
      ref={ref}
    >
      <h2 className="self-start flex font-extrabold text-2xl pb-2">
        Mentör Programım
      </h2>
      <aside className="w-full h-auto py-2 px-1">
        <div className="w-full items-center justify-between h-auto flex flex-row">
          {loading ? (
            <LoadingSkeleton textLine={2} isWidthFull mode={"label"} />
          ) : (
            <>
              <User
                name={`${mentor?.mentor_name} (Mentörüm)`}
                aria-label="Mentör Verileri"
                description={mentor?.mentor_phone}
                className="dark"
                avatarProps={{
                  src: mentor?.mentor_avatar,
                }}
              />
              <Chip
                color={mentorStatus ? "success" : "warning"}
                variant="flat"
                size="lg"
                className="dark"
              >
                {mentorStatus ? "Programım Aktif" : "Programım Aktif Değil"}{" "}
              </Chip>
            </>
          )}
        </div>
        <Divider orientation="horizontal" />
        <div className="w-full h-auto my-4 ">
          <ul className="w-full h-auto items-start justify-start flex flex-col text-base font-light tracking-tighter -mb-4">
            {loading ? (
              <LoadingSkeleton
                mode={"text"}
                maxW={"500px"}
                textLine={"2"}
                repeat={5}
                isWidthFull
              />
            ) : (
              transitions((style, item) => {
                const [key, val] = item;
                const config = {
                  isTransportationCardCreated: "Ulaşım Kartı İşlemleri",
                  isBankAccountCreated: "Banka Hesabı İşlemleri",
                  isAirportPickupCompleted: "Havalimanı Karşılaması",
                  isAccommodationCompleted: "Konaklama & Yerleşim",
                  isSimCardCompleted: "Sim Kart İşlemi",
                };
                return (
                  <animated.li
                    className="py-[5px] my-1 w-full items-center justify-between flex flex-row bg-slate-900 rounded-lg"
                    style={style}
                    key={key}
                  >
                    <span className={`pl-4 ${val && "line-through"} `}>
                      {config[key]}
                    </span>
                    <span className="w-auto h-auto relative pr-4">
                      {val ? (
                        <ConfirmedAnimation h={"25px"} w={"25px"} />
                      ) : (
                        <ErrorAnimation />
                      )}
                    </span>
                  </animated.li>
                );
              })
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};
