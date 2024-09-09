import React, { useState, useEffect } from "react";
import { GrStatusGoodSmall } from "react-icons/gr";
import { TbGridDots } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt, FaUniversity } from "react-icons/fa";
import { FaCity } from "react-icons/fa6";
import { Input } from "@nextui-org/react";
import { useSpring, animated } from "@react-spring/web";
import { useSelector } from "react-redux";

export const ProfileInput = ({
  val,
  content,
  label,
  isFullWidth,
  isBool,
  onChange,
}) => {
  const { action } = useSelector((state) => state.studentProfileActions);
  const [param, setParam] = useState(val);

  useEffect(() => {
    setParam(val);
  }, [val]);

  const anim = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(-40px) scale(0.9) rotate(-10deg)",
    },
    to: { opacity: 1, transform: "translateX(0) scale(1) rotate(0deg)" },
    config: { mass: 1, tension: 280, friction: 12 },
  });

  const contentList = {
    profile: <CgProfile className="w-4 h-4" />,
    grid: <TbGridDots className="w-4 h-4" />,
    phone: <FaPhoneAlt className="w-4 h-4" />,
    university: <FaUniversity className="w-4 h-4" />,
    city: <FaCity className="w-4 h-4" />,
    dot: <GrStatusGoodSmall className="w-4 h-4" />,
  };

  const prohibitedValues = [
    "university",
    "program",
    "registration_date",
    "isVisaCompleted",
    "isTrcCompleted",
    "isUniversityRegistrationProcessCompleted",
    "isMentorShipCompleted",
    "city",
  ];

  const handleInputChange = (e) => {
    if (action !== "view") {
      setParam(e.target.value);
      onChange(content, e.target.value);
    }
  };

  const isReadOnly = action === "view" || prohibitedValues.includes(content);

  return (
    <animated.li
      style={anim}
      className={`h-auto ${
        isFullWidth ? "w-full" : "w-1/2"
      } list-none capitalize`}
    >
      <Input
        variant="flat"
        color={isBool ? (param ? "success" : "warning") : "default"}
        label={label}
        value={isBool ? (param ? "Tamamlanmış" : "Tamamlanmamış") : param}
        readOnly={isReadOnly}
        isRequired={!isReadOnly}
        onChange={handleInputChange}
        startContent={contentList[content]}
        className={"dark w-full capitalize"}
      />
    </animated.li>
  );
};
