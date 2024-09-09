import { useDispatch, useSelector } from "react-redux";
import { Inter } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import { useSpring, animated } from "@react-spring/web";
import { Raleway } from "next/font/google";
import alertModal from "@/utils/assistants/alertModal";
import React, { useState } from "react";
import { Progress } from "@nextui-org/react";
import idGenerator from "@/utils/assistants/idGenerator";
import { setStep } from "@/stores/slices/stepSlice";

const bannerFont = Dancing_Script({
  subsets: ["latin"],
});

const subFont = Inter({
  subsets: ["latin"],
});

const raleway = Raleway({
  subsets: ["latin"],
});

export const Redirection = () => {
  const { name, surname } = useSelector((state) => state.auth);
  const [visibleMark, setVisibleMark] = useState(false);
  const [showGiftCode, setShowGiftCode] = useState(false);
  const [redirect] = useState(false);
  const dispatch = useDispatch();

  const TypingAnimation = ({ text, delay, fontSize }) => {
    const breakText = text.replace(/\\n/g, "\n");
    const springProps = useSpring({
      to: async (next) => {
        for (let i = 0; i < breakText.length; i++) {
          !redirect && (await next({ value: breakText.substring(0, i + 1) }));
          !redirect && (await new Promise((res) => setTimeout(res, delay)));
        }
      },
      from: { value: " " },
    });

    return (
      <animated.span
        className={`${fontSize} transition-all duration-200 mt-4 self-start ${
          visibleMark ? "visible" : "invisible"
        }`}
      >
        {springProps.value}
      </animated.span>
    );
  };

  const headerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
    onStart: () => {
      setTimeout(() => {
        setVisibleMark(true);
      }, 500);
    },
  });

  const progressSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 3000 },
    onRest: () => {
      setTimeout(() => {
        setShowGiftCode(true);
      }, 3000);
    },
  });

  const GiftCode = () => {
    const [copied, setCopied] = useState(false);

    const animation = useSpring({
      opacity: copied ? 1 : 0,
      transform: copied ? "translateY(0)" : "translateY(-100%)",
    });
    const handlePushLogin = () => {
      setTimeout(() => {
        dispatch(
          setStep({
            no: 0,
            auth: "student",
          })
        );
      }, 1500);
    };
    return (
      <div
        className={`flex ${
          redirect && "hidden"
        } items-center flex-col container gap-3 relative top-16 justify-center ${
          raleway.className
        }`}
      >
        <button
          className="bg-rose-500 hover:bg-rose-400 text-xl text-white font-light py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline tracking-widest w-auto"
          onClick={() => {
            setCopied(true);
            alertModal({
              toastTitle: "Hediye Kodu Kopyalandı",
              toastIcon: "success",
            });
            handlePushLogin();
          }}
        >
          <code>{idGenerator(20, "letter")}</code>
        </button>
        <animated.span className="ml-2 text-white text-sm" style={animation}>
          Hediye kodu kopyalandı!
        </animated.span>
      </div>
    );
  };

  return (
    <div
      className={`w-full h-full bg-black/50 z-50 ${bannerFont.className} items-center justify-center flex`}
    >
      <div className="text-white text-start items-center justify-center flex flex-col text-4xl h-1/2 w-1/2">
        <animated.h2 className={`font-light self-start`} style={headerSpring}>
          Aramıza hoşgeldin,
        </animated.h2>
        <TypingAnimation
          delay={!showGiftCode ? "175" : "35"}
          fontSize={
            !showGiftCode ? "text-7xl text-rose-400" : "text-3xl text-lime-400"
          }
          text={
            showGiftCode
              ? "Senin için bir sürpriz hazırladık. Kodu kopyalamak için butona tıkla!"
              : name + " " + surname
          }
        />
        <animated.div
          className="w-full items-center justify-center flex flex-col"
          style={progressSpring}
        >
          {showGiftCode ? (
            <GiftCode />
          ) : (
            <>
              <Progress
                color="danger"
                className="light max-w-lg top-44 relative"
                minValue={0}
                maxValue={100}
                value={28}
                isIndeterminate
                size="sm"
                aria-label="loading..."
              />
              <h2
                className={`top-48 relative text-base font-light ${raleway.className}`}
              >
                Verilerin Kaydediliyor...
              </h2>
            </>
          )}
        </animated.div>
      </div>

      {showGiftCode && (
        <h2
          className={`${subFont.className} fixed bottom-8 text-xs tracking-tight text-amber-200`}
        >
          Giriş yaptığınız e-posta ve kişisel bilgilerinizi lütfen kimseyle
          paylaşmayın.
        </h2>
      )}
    </div>
  );
};
