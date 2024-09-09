import { Input, Textarea } from "@nextui-org/react";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import { MdTitle } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { TbPinnedFilled } from "react-icons/tb";
import getRandomColor from "@/utils/assistants/getRandomColor";

export const Reminder = ({ header, note, date }) => {
  const [isNew, setIsNew] = useState(true);
  const [pinColor, setPinColor] = useState("");

  useEffect(() => {
    if (isNew) {
      setPinColor(getRandomColor());
      setIsNew(false);
    }
  }, [isNew]);

  const anim = useSpring({
    from: isNew
      ? {
          opacity: 0,
          transform: "translateX(-40px) scale(0.9) rotate(-10deg)",
        }
      : {},
    to: {
      opacity: 1,
      transform: "translateX(0) scale(1) rotate(0deg)",
    },
    config: { mass: 1, tension: 280, friction: 12 },
  });

  return (
    <animated.li
      style={{ ...anim, scale: 0.95 }}
      className="w-1/2 text-white items-center justify-start bg-slate-950 rounded-xl flex flex-col gap-1 text-start h-auto overflow-y-scroll p-4 relative"
    >
      <Input
        color="success"
        variant="flat"
        size="md"
        readOnly
        value={header}
        className="dark"
        startContent={<MdTitle className="w-4 h-4" />}
      />
      <Input
        value={date}
        variant="bordered"
        className="dark"
        readOnly
        startContent={<CiCalendarDate className="w-5 h-5" />}
      />
      <Textarea
        value={note}
        readOnly
        className="dark"
        variant="bordered"
        size="sm"
      />
      <span
        className={`absolute top-0 -left-0 ${pinColor}`}
        style={{ color: pinColor }}
      >
        <TbPinnedFilled
          className={`w-8 h-8 -rotate-45 -skew-y-12 rounded-full animate-pulse ${pinColor}`}
        />
      </span>
    </animated.li>
  );
};
