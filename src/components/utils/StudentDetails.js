import React, { useEffect, useState } from "react";
import {
  Chip,
  Divider,
  Input,
  User,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { FaPhoneAlt, FaUniversity } from "react-icons/fa";
import { FaArrowRight, FaCity } from "react-icons/fa6";
import { TbGridDots } from "react-icons/tb";
import { Inter } from "next/font/google";
import { CgProfile } from "react-icons/cg";
import { GrStatusGoodSmall } from "react-icons/gr";
import findStudent from "@/utils/db/adminQueries/findStudent";
import findAppointments from "@/utils/db/adminQueries/findAppointments";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

const headerFont = Inter({
  subsets: ["latin"],
});

export const StudentDetails = ({ student_id }) => {
  const [studentData, setStudentData] = useState({});
  const [studentAppointments, setStudentAppointments] = useState(null);
  const [loading, setLoading] = useState({
    loadingAppointment: true,
    loadingUser: true,
  });

  useEffect(() => {
    const fetchStudentsData = async () => {
      const foundAppointments = await findAppointments(student_id).finally(() =>
        setLoading((prev) => ({ ...prev, loadingAppointment: false }))
      );
      const foundUser = await findStudent(student_id).finally(() =>
        setLoading((prev) => ({ ...prev, loadingUser: false }))
      );
      if (foundAppointments && foundUser) {
        foundAppointments.length > 0
          ? setStudentAppointments([...foundAppointments])
          : setStudentAppointments([]);
        foundUser ? setStudentData({ ...foundUser }) : setStudentData({});
      }
    };
    fetchStudentsData();
  }, [student_id]);

  if (loading.loadingAppointment || loading.loadingUser) {
    return (
      <>
        <br />
        <LoadingSkeleton isWidthFull mode={"label"} textLine={2} />
        <LoadingSkeleton isWidthFull mode={"text"} repeat={4} textLine={3} />
        <br />
      </>
    );
  }
  return (
    <div className="w-full p-8 max-h-[80vh] min-h-min overflow-y-scroll">
      <div className=" items-center justify-between flex flex-row w-full h-auto sticky">
        <User
          name={studentData.name}
          description={studentData.email}
          className="dark scale-125"
          avatarProps={{
            src: studentData.avatar,
          }}
        />
        <Chip
          color="success"
          size="lg"
          className="cursor-pointer hover:scale-105 transition duration-200"
          variant="flat"
        >
          <code>#{studentData.id}</code>
        </Chip>
      </div>
      <div
        className={`-ml-4 ${headerFont.className} mt-4 items-start justify-start flex flex-col gap-y-2 tracking-tight`}
      >
        <Divider orientation="horizontal" className="border-white dark my-1 " />

        <div className="items-center justify-between flex flex-row w-full h-auto my-2">
          <h2 className=" text-md font-light text-slate-400">
            Öğrenci Bilgileri
          </h2>
        </div>
        <div className="items-center justify-center flex w-full flex-row gap-2">
          <Input
            disabled
            color="default"
            type="email"
            label="Okuduğu Bölüm"
            variant="faded"
            value={studentData.program}
            className="max-w-xs dark"
            startContent={<TbGridDots />}
          />
          <Input
            disabled
            type="text"
            label="Üniversite"
            variant="faded"
            value={studentData.university}
            className="max-w-xs dark"
            startContent={<FaUniversity />}
          />
        </div>
        <div className="items-center justify-center flex w-full flex-row gap-2">
          <Input
            disabled
            color={
              studentData.status === "onaylanmış"
                ? "success"
                : studentData.status === "reddedilmiş"
                ? "danger"
                : "warning"
            }
            type="text"
            label="Kayıt Durumu"
            value={studentData.status}
            className="max-w-xs dark capitalize"
            startContent={<GrStatusGoodSmall />}
          />
          <Input
            disabled
            type="number"
            label="Yaş"
            variant="faded"
            value={studentData.age}
            className="max-w-xs dark"
            startContent={<CgProfile />}
          />
        </div>
        <div className="items-center justify-center flex w-full flex-row gap-2">
          <Input
            disabled
            type="text"
            label="Şehir"
            variant="faded"
            value={studentData.city}
            className="max-w-xs dark"
            startContent={<FaCity />}
          />
          <Input
            disabled
            type="phone"
            label="Telefon Numarası"
            variant="faded"
            value={studentData.phone}
            className="max-w-xs dark"
            startContent={<FaPhoneAlt />}
          />
        </div>
        <Divider orientation="horizontal" className="border-white dark my-2" />
        <div className="items-center justify-between flex flex-row w-full h-auto mt-2">
          <h2 className=" text-md font-light text-slate-400">
            Öğrenciye Kayıtlı Randevular
          </h2>
          <Chip color="warning" size="md" variant="flat">
            Toplam Aktif Randevu: <code>{studentAppointments?.length}</code>
          </Chip>
        </div>
        <Table
          layoutNode={"hha"}
          className="dark"
          color={"success"}
          aria-label="Randevu listesi"
          selectionMode="none"
        >
          <TableHeader>
            <TableColumn align="center">Randevu ID</TableColumn>
            <TableColumn align="center">Tarih</TableColumn>
            <TableColumn align="center">Randevu Notu</TableColumn>
            <TableColumn align="center">Randevu Bağlantısı</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Randevu Bulunamadı"}>
            {studentAppointments?.map((val, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Chip color="success" size="sm" variant="flat">
                    <code>#{val.id}</code>
                  </Chip>
                </TableCell>
                <TableCell>{val.date + " " + val.hour}</TableCell>
                <TableCell>{val.desc}</TableCell>
                <TableCell>
                  <a
                    className="text-bold pt-1 text-sm capitalize text-slate-500 flex flex-row gap-2  items-center justify-center   h-auto   hover:text-white/80"
                    href={val.link}
                    target="_blank"
                  >
                    <span>Bağlantı</span>
                    <FaArrowRight className="w-3 h-3 " />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
