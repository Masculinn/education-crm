import { Avatar } from "@nextui-org/react";
import { MessageBoxPlaceHolder } from "./MessageBoxPlaceholder";

export const ChatBox = ({ handleClick, email, name, imgSrc, text }) => {
  if (name === null || email === null || text === null) {
    return <MessageBoxPlaceHolder />;
  }

  return (
    <button
      className="max-w-[300px] w-full flex items-center gap-3 lg:hover:scale-[1.01]  transition-all duration-200 cursor-pointer rounded-lg"
      onClick={handleClick}
    >
      <figure>
        <Avatar
          className="flex rounded-full w-12 h-12 dark"
          src={imgSrc}
          name={name}
          alt={name}
        />
      </figure>
      <div className="w-full flex flex-col gap-2">
        <label className="h-auto w-3/5 rounded-lg text-start px-1 text-md/tight overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
          {name}
        </label>

        <label className="h-auto w-full text-start px-1 text-xs/tight -mt-2  rounded-lg text-success-400 cursor-pointer">
          {text}
        </label>
      </div>
    </button>
  );
};
