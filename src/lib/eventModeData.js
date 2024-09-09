import { IoTicketOutline } from "react-icons/io5";
import { PiCardsThin } from "react-icons/pi";
import { EditIcon } from "@/components/icons/EditIcon";

export default [
  {
    x: "Ticket Event",
    y: <IoTicketOutline className="w-5 h-5" />,
  },
  {
    x: "Card Event",
    y: <PiCardsThin className="w-5 h-5" />,
  },
  {
    x: "Medium Card Event",
    y: <PiCardsThin className="w-4 h-4" />,
  },
  {
    x: "Small Card Event",
    y: <PiCardsThin className="w-3 h-3" />,
  },
  {
    x: "Kayıtlı Etkinlikleri Düzenle",
    y: <EditIcon />,
  },
];
