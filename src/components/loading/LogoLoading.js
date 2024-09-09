import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const LogoLoading = ({ h, w }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { loading } = useSelector((state) => state.loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <Image
      src={"/edu-logo.png"}
      alt="olympos edu logo"
      height={h}
      className={` ${
        isLoading ? "fixed" : "hidden"
      } bg-white bottom-8 right-8  rounded-full scale-50 rotate-360 duration-0 infinite mt-8`}
      width={w}
    />
  );
};

export { LogoLoading };
