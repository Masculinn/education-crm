import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { CgInfo } from "react-icons/cg";
import { useSelector } from "react-redux";
import viewStudentAppointments from "@/utils/db/viewStudentAppointments";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

export const MyAppointments = () => {
  const { id } = useSelector((state) => state.login);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findAppointments = async () => {
      const appData = await viewStudentAppointments(id).finally(() => {
        setLoading(false);
      });
      if (appData) {
        setAppointments(appData);
      }
    };
    findAppointments();
  }, [id]);

  return (
    <div className="w-full h-full items-start justify-start lg:gap-8 gap-4  flex flex-col">
      <h2 className="self-start  flex font-extrabold lg:text-2xl text-3xl lg:pb-4">
        Randevularım
      </h2>
      {loading ? (
        <LoadingSkeleton isWidthFull mode={"card"} />
      ) : (
        <>
          <Table
            className="dark"
            isCompact
            selectionMode="none"
            aria-label="Student Appointments"
          >
            <TableHeader aria-label="Student Appointments">
              <TableColumn>Açıklama</TableColumn>
              <TableColumn>Tarih</TableColumn>
              <TableColumn>Saat</TableColumn>
              <TableColumn>Toplantı Linki</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"Randevu Bulunamadı"}
              aria-label="Student Appointments"
            >
              {appointments?.map((val, idx) => (
                <TableRow key={idx + 1} aria-label="Student Appointments">
                  <TableCell>
                    <p className="w-40 h-auto">{val.desc}</p>
                  </TableCell>
                  <TableCell>{val.date}</TableCell>
                  <TableCell>{val.hour}</TableCell>
                  <TableCell>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={val.link}
                      className="w-36 h-auto flex items-center justify-start flex-row gap-2 text-success-500"
                    >
                      <span>Toplantıya Git</span>{" "}
                      <FaArrowRight className="w-4 h-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="w-full h-auto text-sm text-slate-400 text-start justify-start flex flex-row lg:-mt-4 gap-1">
            <CgInfo className="w-14 h-14 text-success-500 flex mr-3" />
            <span>
              {" "}
              Randevu Saat Bilgileri bulunduğunuz ülkeye göre değişiklik
              gösterebilir. Dolayısıyla mesaj kanalımızdan detaylı bilgi almayı
              unutmayın {":)"}
            </span>
          </p>
        </>
      )}
    </div>
  );
};
