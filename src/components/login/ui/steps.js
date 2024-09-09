import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTransition, animated } from "@react-spring/web";
import { stepsItems } from "@/config/config_login";

export const Steps = () => {
  const { no } = useSelector((state) => state.step);

  const [steps, setStep] = useState({
    stepsItems,
    currentStep: no - 2,
  });

  const transitions = useTransition(steps.stepsItems, {
    from: { opacity: 0, transform: "translate3d(0,-20px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-20px,0)" },
    config: { mass: 1, tension: 500, friction: 40 },
  });

  useEffect(() => {
    setStep((prevSteps) => ({
      ...prevSteps,
      currentStep: no - 2,
    }));
  }, [no]);

  return (
    <div className="w-full -ml-12 scale-85  ">
      <ul
        aria-label="Steps"
        className="items-center text-slate-200 font-medium md:flex"
      >
        {transitions((style, item, _, index) => (
          <animated.li
            style={style}
            aria-current={steps.currentStep === index ? "step" : false}
            className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0"
            key={index}
          >
            <div className="flex flex-col items-center md:flex-row md:flex-1">
              <hr
                className={`w-full border hidden md:block ${
                  index === 0
                    ? "border-none"
                    : "" || steps.currentStep >= index
                    ? "border-rose-600"
                    : ""
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                  steps.currentStep > index
                    ? "bg-rose-600 border-rose-600"
                    : "" || steps.currentStep === index
                    ? "border-rose-600"
                    : ""
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-rose-600 ${
                    steps.currentStep !== index ? "hidden" : ""
                  }`}
                ></span>
                {steps.currentStep > index ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  ""
                )}
              </div>
              <hr
                className={`h-12 border md:w-full md:h-auto ${
                  index + 1 === steps.stepsItems.length
                    ? "border-none"
                    : "" || steps.currentStep > index
                    ? "border-rose-600"
                    : ""
                }`}
              />
            </div>
            <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
              <h3
                className={`text-sm ${
                  steps.currentStep === index ? "text-rose-600" : ""
                }`}
              >
                {item}
              </h3>
            </div>
          </animated.li>
        ))}
      </ul>
    </div>
  );
};
