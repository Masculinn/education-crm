import { getDate } from "@/utils/assistants/getDate";
import { Button, Chip, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { TbReportMoney } from "react-icons/tb";
import { useSelector } from "react-redux";
import { IoWarningOutline } from "react-icons/io5";
import idGenerator from "@/utils/assistants/idGenerator";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import sendFinanceReport from "@/utils/db/adminQueries/finance_module/sendFinanceReport";

export const Reports = () => {
  const { id: userID } = useSelector((state) => state.login);
  const [err, setErr] = useState(false);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState({
    id: null,
    header: "",
    cost: "",
    note: "",
    date: "",
    mode: null,
    authorID: userID,
  });

  const handleSubmit = async (mode) => {
    if (reports.header === "" || reports.cost === "" || reports.note === "") {
      setErr(true);
      return;
    } else {
      setLoading(true);

      const generateID = idGenerator(10);

      const newReport = {
        id: generateID,
        header: reports.header,
        cost: Math.ceil(reports.cost),
        note: reports.note,
        date: getDate(),
        mode: mode,
        authorID: userID,
      };

      const sendFinance = await sendFinanceReport({
        props: newReport,
      }).finally(() => setLoading(false));

      if (!sendFinance) return;
      else {
        setReports(newReport);

        setAllReports((prev) => [...prev, newReport]);
        setErr(false);
        setTimeout(() => {
          setReports({
            id: null,
            header: "",
            cost: "",
            note: "",
            date: "",
            mode: null,
            authorID: userID,
          });
        }, 1000);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-auto items-start justify-start flex flex-col">
        <LoadingSkeleton
          mode={"text"}
          repeat={2}
          isWidthFull
          textLine={5}
          maxW={"305px"}
        />
      </div>
    );
  }
  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto gap-2 pb-4 items-center justify-start flex flex-row">
        <TbReportMoney className="w-8 h-8" />
        <h2 className=" tracking-tighter text-2xl font-bold">Rapor Düzenle</h2>
      </div>
      <div className="items-start justify-start flex flex-col lg:gap-4 gap-2">
        <div className="w-full h-auto items-center justify-center flex flex-row lg:gap-2 gap-1">
          <Input
            type="text"
            variant="bordered"
            aria-label="Rapor Başlığı"
            label="Rapor Başlığı"
            isClearable
            className="dark w-2/3"
            color="default"
            onClear={() => {
              setReports((prev) => ({ ...prev, header: "" }));
            }}
            fullWidth
            labelPlaceholder="Rapor Başlığı"
            value={reports.header}
            onChange={(e) => {
              setReports((prev) => ({ ...prev, header: e.target.value }));
            }}
          />
          <Input
            type="number"
            inputMode="numeric"
            variant="bordered"
            aria-label="Rapor Tutar Girdisi"
            label="Tutar"
            onClear={() => {
              setReports((prev) => ({ ...prev, cost: "" }));
            }}
            startContent={<span className="-my-[2.5px]">€</span>}
            className="dark w-1/3"
            color="default"
            value={reports.cost}
            onChange={(e) => {
              setReports((prev) => ({ ...prev, cost: e.target.value }));
            }}
          />
        </div>
        <Textarea
          className="dark"
          label="Rapor Notu"
          variant="bordered"
          color="default"
          value={reports.note}
          onChange={(e) => {
            setReports((prev) => ({
              ...prev,
              note: e.target.value,
            }));
          }}
        />
        {err && (
          <div className="w-full h-auto items-center justify-start flex flex-row gap-1 text-warning-400 font-semibold tracking-tight text-sm">
            <IoWarningOutline className="w-6 h-6 " />
            <span>Veriler boş bırakılmamalıdır</span>
          </div>
        )}
        <div className="w-full h-auto items-center justify-start flex flex-row gap-2">
          <Button
            color="danger"
            variant="flat"
            size="md"
            className="dark"
            onClick={() => {
              handleSubmit("expense");
            }}
          >
            Gider Raporu Düzenle
          </Button>
          <Button
            color="success"
            variant="flat"
            size="md"
            className="dark"
            onClick={() => {
              handleSubmit("income");
            }}
          >
            Gelir Raporu Düzenle
          </Button>
        </div>
      </div>
    </div>
  );
};
