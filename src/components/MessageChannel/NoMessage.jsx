import { CgInfo } from "react-icons/cg";
import { Error } from "../utils/Error";

export const NoMessage = ({ wrapperStyle }) => {
  return (
    <div
      className={` ${wrapperStyle} px-16 w-auto h-full   items-center justify-center flex`}
    >
      <div className="w-full h-auto p-4  items-center tracking-tighter justify-center flex text-warning-300 rounded-lg shadow-lg gap-2">
        <Error errorNote="Lütfen Sohbet Başlatın." header="Oops, Sohbet Yok" />
      </div>
    </div>
  );
};
