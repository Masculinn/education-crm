import { Avatar, Chip } from "@nextui-org/react";
import { BiInfoCircle } from "react-icons/bi";

export const ReceiverInfo = (props) => {
  const { avatar, name, program } = props;
  return (
    <div className="top-0 absolute right-0 h-12 items-center lg:px-4 px-2 justify-between flex w-full bg-slate-950/70 gap-2 backdrop-blur-lg z-50">
      <div className="items-center justify-center flex gap-2">
        <Avatar
          src={avatar}
          alt={name}
          name={name}
          className="dark"
          size="sm"
        />
        <span className="lg:text-base text-xs">{name}</span>
      </div>
      <Chip
        color="success"
        variant="flat"
        size="sm"
        startContent={<BiInfoCircle className="w-4 h-4" />}
      >
        {program}
      </Chip>
    </div>
  );
};
