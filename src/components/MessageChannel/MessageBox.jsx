import { TiTick } from "react-icons/ti";
import { useSpring, animated } from "@react-spring/web";

export const MessageBox = ({ isEnd, text, time }) => {
  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(25px) rotate(-5deg)" },
    to: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    config: { friction: 12, tension: 280, mass: 1 },
  });

  const checkAutomate = text.includes("tarafından başlatıldı");
  return (
    <animated.div
      className={`flex justify-start m-2 ${
        isEnd
          ? "self-end rounded-l-xl rounded-br-xl"
          : "self-start rounded-r-xl rounded-bl-xl"
      } lg:max-w-lg max-w-52 w-auto h-auto p-4 items-start gap-2 flex-col tracking-tight bg-stone-900 ${
        checkAutomate
          ? "bg-transparent border-2 border-green-400  "
          : "bg-stone-900"
      } `}
      style={animation}
    >
      <div
        className={`w-auto h-auto lg:text-sm text-xs ${
          checkAutomate && "italic text-stone-300"
        } `}
      >
        {text}
      </div>
      <div
        className={`w-auto h-auto lg:text-xs items-center justify-center flex self-end flex-row gap-1 ${
          checkAutomate ? "text-stone-300" : "text-green-400"
        }`}
      >
        <time className="text-xs">{time}</time>
        <TiTick className="w-4 h-4" />
      </div>
    </animated.div>
  );
};
