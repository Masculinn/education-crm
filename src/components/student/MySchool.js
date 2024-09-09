import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DM_Sans } from "next/font/google";
import { Button } from "@nextui-org/react";
import { FaArrowRight, FaUniversity } from "react-icons/fa";
import { TiWorld } from "react-icons/ti";
import { useSpring, useTrail, animated } from "@react-spring/web";
import universitiesdb from "@/lib/universitiesdb";

const font = DM_Sans({
  subsets: ["latin"],
});

export const MySchool = () => {
  const { id, name, university, program } = useSelector((state) => state.login);
  const [uniInfo, setUniInfo] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const findSchool = universitiesdb?.find((val) => val.name === university);
    if (findSchool) {
      setUniInfo({
        name: name,
        img: findSchool.img,
        program: program,
        link: findSchool.link,
        city: findSchool.data.city,
        word_rank: findSchool.data.world_rank,
        languages: findSchool.data.languages,
      });
      setLoaded(true);
    }
  }, [id]);

  const trail = useTrail(4, {
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: {
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translate3d(0,0px,0)" : "translate3d(0,40px,0)",
    },
    config: { mass: 5, tension: 2000, friction: 200 },
    delay: 500,
  });

  const welcomeSpring = useSpring({
    from: { opacity: 0, transform: "translate3d(-40px,0,0)" },
    to: {
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translate3d(0,0,0)" : "translate3d(-40px,0,0)",
    },
    config: { mass: 5, tension: 2000, friction: 1000 },
    delay: 250,
  });

  const titleSpring = useSpring({
    from: { opacity: 0, transform: "translate3d(40px,0,0)" },
    to: {
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translate3d(0,0,0)" : "translate3d(40px,0,0)",
    },
    config: { mass: 5, tension: 2000, friction: 1000 },
    delay: 250,
  });

  return (
    <section className={`w-full h-auto ${font.className}`}>
      <div
        className="w-full h-72 bg-cover bg-center object-cover mix-blend-exclusion rounded-2xl shadow-lg"
        style={{ backgroundImage: `url(${uniInfo?.img})` }}
      >
        <div className="w-full h-full bg-gradient-to-r from-slate-950/75 to-slate-500/50 rounded-2xl relative items-center justify-between flex flex-row">
          <div className="rounded-2xl relative w-1/2 h-full">
            <div className="w-full h-full lg:px-8 lg:pt-12 px-4 pt-6 items-start justify-start flex flex-col">
              <animated.span style={welcomeSpring} className="text-base">
                Tekrar Hoşgeldiniz <b>{name}</b>
              </animated.span>
              <animated.h2
                style={titleSpring}
                className="lg:text-4xl text-3xl font-extrabold tracking-tighter lg:pt-8 pt-4 leading-none"
              >
                {university}
              </animated.h2>
              <span className="text-slate-300 lg:text-base text-sm">
                {uniInfo.program}
              </span>
            </div>
            <Button
              className="lg:bottom-8 lg:left-8 bottom-4 left-4 absolute dark font-semibold items-center justify-center flex flex-row"
              variant="bordered"
              color="warning"
              endContent={<FaArrowRight />}
            >
              <a
                href={uniInfo.link}
                target="_blank"
                rel="norefferer"
                className="w-full h-full flex items-center"
              >
                Üniversitem
              </a>
            </Button>
          </div>
          <div className="w-1/2 rounded-2xl h-full items-center justify-center flex">
            <div className="lg:w-1/2 w-full h-2/3 lg:ml-24  rounded-2xl items-center justify-center flex flex-wrap lg:mx-0 mx-2">
              {trail.map((style, index) => (
                <animated.span
                  key={index}
                  style={{ ...style, scale: "0.9" }}
                  className={`w-1/2 h-1/2 flex items-center justify-center text-center rounded-2xl  ${
                    index === 0 ? "bg-white/50" : "bg-slate-950/55"
                  }`}
                >
                  {index === 0 ? (
                    <FaUniversity className="w-8 h-8 text-slate-950" />
                  ) : index === 1 ? (
                    uniInfo.city
                  ) : index === 2 ? (
                    <>
                      <TiWorld className="w-7 h-7" />
                      {uniInfo.word_rank}
                    </>
                  ) : uniInfo.languages ? (
                    uniInfo.languages.join(", ")
                  ) : (
                    ""
                  )}
                </animated.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
