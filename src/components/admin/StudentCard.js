import React, { useEffect, useRef, useState } from "react";
import { TbGridDots } from "react-icons/tb";
import { GrStatusGoodSmall } from "react-icons/gr";
import {
  FaCity,
  FaPhone,
  FaUniversity,
  FaUserCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import {
  Input,
  Chip,
  User,
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableColumn,
  Textarea,
} from "@nextui-org/react";
import { valueSet } from "../utils/valueSet";
import { colorSet } from "../utils/colorSet";
import { useDispatch, useSelector } from "react-redux";
import findAppointments from "@/utils/db/adminQueries/findAppointments";
import findMentor from "@/utils/db/findMentor";
import findStudent from "@/utils/db/adminQueries/findStudent";
import { Error } from "../utils/Error";
import { ViewDocument } from "../utils/ViewDocument";
import viewStudentDetails from "@/utils/db/adminQueries/viewStudentDetails";
import viewStudentDocuments from "@/utils/db/viewStudentDocuments";
import universitiesdb from "@/lib/universitiesdb";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

export const StudentCard = () => {
  const studentCardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({
    main: {},
    mentor: {},
    appointments: [],
    details: {},
    docs: {},
  });
  const { id } = useSelector((state) => state.studentView);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== "") {
      const fetchStudentCredentials = async () => {
        setLoading(true);
        const fetchStudent = await findStudent(id && id);
        const mentor = await findMentor(id && id, dispatch);
        const studentDet = await viewStudentDetails(id && id);
        const docs = await viewStudentDocuments(id && id);
        const appointments = await findAppointments(id && id).finally(() => {
          setLoading(false);
        });
        if (fetchStudent && mentor && appointments && studentDet && docs) {
          setStudent({
            appointments: appointments,
            main: fetchStudent,
            mentor: mentor,
            details: studentDet,
            docs: docs,
          });
        }
      };
      fetchStudentCredentials();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        id="student_card"
        className="w-full h-auto p-8 mt-4  items-center justify-center flex"
      >
        <LoadingSkeleton isWidthFull mode={"card"} />
      </div>
    );
  }

  if (id === "") {
    return (
      <div
        className={`w-full h-auto lg:p-8 my-4   items-center justify-center flex`}
        id="student_card"
        ref={studentCardRef}
      >
        <Error
          errorNote={
            "Lütfen atlastan bir öğrenci seçip, öğrencinin detaylarına tıklayın."
          }
          header={"Öğrenci Seçin"}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full border border-slate-800 shadow-md rounded-2xl h-auto p-8 mt-4"
      id="student_card"
      ref={studentCardRef}
    >
      <div className=" items-center justify-between flex flex-row w-full h-auto ">
        <User
          name={student.main.name}
          description={student.main.email}
          className="dark scale-125"
          avatarProps={{
            src: student.main.avatar,
          }}
        />
        <Chip
          color="success"
          size="lg"
          className="cursor-pointer hover:scale-105 transition duration-200"
          variant="flat"
        >
          <code>{student.main.id}</code>
        </Chip>
      </div>
      <div
        className={`-ml-4  mt-4 items-start justify-start flex flex-col gap-y-2 tracking-tight`}
      >
        <Accordion
          defaultExpandedKeys={["1", "2"]}
          className="dark"
          isCompact={false}
          keepContentMounted={true}
        >
          <AccordionItem
            key="1"
            aria-label="Genel Bilgileri"
            title="Genel Bilgileri"
          >
            <div className="items-center justify-center flex w-full lg:flex-row flex-col gap-2">
              <Input
                disabled
                type="text"
                label="Öğrencinin Yaşı"
                variant="bordered"
                value={student.main.age}
                className="max-w-xs dark"
                startContent={<FaUserCircle />}
              />
              <Input
                disabled
                type="text"
                label="Şehir"
                variant="bordered"
                value={student.main.city}
                className="max-w-xs dark"
                startContent={<FaCity />}
              />
              <Input
                disabled
                type="text"
                label="Öğrenci Adresi"
                variant="bordered"
                value={student.main.address}
                className="max-w-xs dark"
                startContent={<FaUserCircle />}
              />
            </div>
            <div className="items-center justify-center flex w-full flex-row gap-2 mt-2">
              <Input
                disabled
                type="text"
                label="Telefon Numarası"
                variant="bordered"
                value={student.main.phone}
                className="w-1/2 dark"
                startContent={<FaPhone />}
              />
              <Input
                disabled
                color={
                  student.main.status === "onaylanmış"
                    ? "success"
                    : student.main.status === "reddedilmiş"
                    ? "danger"
                    : "warning"
                }
                type="text"
                label="Kayıt Durumu"
                value={student.main.status}
                className="w-1/2 dark capitalize"
                startContent={<GrStatusGoodSmall />}
              />
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Üniversite Bilgileri"
            title="Üniversite Bilgileri"
          >
            <div className="items-center justify-center flex w-full lg:flex-row flex-col gap-2">
              <Input
                disabled
                color="default"
                type="email"
                label="Okuduğu Bölüm"
                variant="bordered"
                value={student.main.program}
                className="max-w-xs dark"
                startContent={<TbGridDots />}
              />
              <Input
                disabled
                type="text"
                label="Üniversite Adı"
                variant="bordered"
                value={student.main.university}
                className="max-w-xs dark"
                startContent={<FaUniversity />}
              />
              <Input
                disabled
                type="text"
                label="Üniversite Sömestr"
                variant="bordered"
                value={student.main.university_semester}
                className="max-w-xs dark"
                startContent={<GrStatusGoodSmall />}
              />
            </div>
            <div className="items-center justify-center flex w-full flex-row gap-2 mt-2">
              <Input
                disabled
                type="text"
                label="Üniversite Link"
                variant="bordered"
                value={
                  universitiesdb.find(
                    (val) => val.name === student.main.university
                  )?.link
                }
                className="w-1/2 dark"
                startContent={<MdOutlineMailOutline />}
              />
              <Input
                disabled
                type="text"
                color={colorSet(student.main.isDocumentsVerified)}
                label="Döküman Durumu"
                variant="flat"
                value={valueSet(student.main.isDocumentsVerified)}
                className="w-1/2 dark"
                startContent={<GrStatusGoodSmall />}
              />
            </div>
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Kayıtlı Randevu Bilgileri"
            title="Kayıtlı Randevu Bilgileri"
          >
            <Table
              className="dark"
              color="default"
              aria-label="Kayıtlı Randevular"
              selectionMode="none"
            >
              <TableHeader>
                <TableColumn align="center">Randevu ID</TableColumn>
                <TableColumn align="center">Tarih</TableColumn>
                <TableColumn align="center">Randevu Notu</TableColumn>
                <TableColumn align="center">Randevu Bağlantısı</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"Öğrenciye Kayıtlı Randevu Bulunamadı"}>
                {student.appointments.map((data, key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Chip color="success" size="sm" variant="flat">
                        <code>#{data.id}</code>
                      </Chip>
                    </TableCell>
                    <TableCell>{data.date}</TableCell>
                    <TableCell>{data.desc}</TableCell>
                    <TableCell>
                      <a
                        className="text-bold pt-1 text-sm capitalize text-slate-500 flex flex-row gap-2  items-center justify-center   h-auto   hover:text-white/80"
                        href={data.link}
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
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Mentör Programı"
            title="Mentör Programı"
          >
            <div className=" items-start justify-start gap-4 flex flex-col w-full h-auto ">
              <User
                name={student.mentor.mentor_name}
                description={"Mentör Tel No:" + student.mentor.mentor_phone}
                className="dark "
                avatarProps={{
                  src: student.mentor.mentor_avatar,
                }}
              />
              <Textarea
                ısReadOnly
                label="Mentörün öğrenci hakkındaki yorumu"
                labelPlacement="outside"
                defaultValue={student.mentor.mentor_note}
                className="w-full"
              />
            </div>
            <div className=" items-start justify-between gap-2 mt-2 flex lg:flex-row flex-col w-full h-auto ">
              <Input
                disabled
                color={colorSet(student.mentor.isTransportationCardCreated)}
                type="text"
                label="Ulaşım Kartı Durumu"
                variant="flat"
                value={valueSet(student.mentor.isTransportationCardCreated)}
                className="w-full dark"
                startContent={<TbGridDots />}
              />
              <Input
                disabled
                color={colorSet(student.mentor.isBankAccountCreated)}
                type="text"
                label="Banka Kartı Durumu"
                variant="flat"
                value={valueSet(student.mentor.isBankAccountCreated)}
                className="w-full dark"
                startContent={<TbGridDots />}
              />
            </div>
            <div className=" items-start justify-between gap-2 mt-2 flex lg:flex-row flex-col w-full h-auto ">
              <Input
                disabled
                color={colorSet(student.mentor.isAirportPickupCompleted)}
                type="text"
                label="Havaalanı Karşılaması Durumu"
                variant="flat"
                value={valueSet(student.mentor.isAirportPickupCompleted)}
                className="w-full dark"
                startContent={<TbGridDots />}
              />
              <Input
                disabled
                color={colorSet(student.mentor.isAccommodationCompleted)}
                type="text"
                label="Konaklama Durumu"
                variant="flat"
                value={valueSet(student.mentor.isAccommodationCompleted)}
                className="w-full dark"
                startContent={<TbGridDots />}
              />
              <Input
                disabled
                color={colorSet(student.mentor.isSimCardCompleted)}
                type="text"
                label="Sim Card Durumu"
                variant="flat"
                value={valueSet(student.mentor.isSimCardCompleted)}
                className="w-full dark"
                startContent={<TbGridDots />}
              />
            </div>
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="TRC Bilgileri"
            title="TRC Bilgileri"
          >
            {student.details?.trc_included === true ? (
              <>
                <div className=" items-start justify-between gap-2 mt-2 flex lg:flex-row flex-col w-full h-auto ">
                  <Input
                    disabled
                    type="text"
                    label="Parmak Izi Tarihi"
                    variant="bordered"
                    value={student.details.fingerprint_date}
                    className="max-w-xs dark"
                    startContent={<GrStatusGoodSmall />}
                  />
                  <Input
                    disabled
                    color={colorSet(student.details.isFingerprintConfirmed)}
                    type="text"
                    label="Parmak Izi Durumu"
                    variant="flat"
                    value={valueSet(student.details.isFingerprintConfirmed)}
                    className="w-full dark"
                    startContent={<TbGridDots />}
                  />
                  <Input
                    disabled
                    color={colorSet(student.details.isDocumentsVerified)}
                    type="text"
                    label="Döküman Onay"
                    variant="flat"
                    value={valueSet(student.details.isDocumentsVerified)}
                    className="w-full dark"
                    startContent={<TbGridDots />}
                  />
                </div>
              </>
            ) : (
              <Chip color="warning" size="lg" variant="flat">
                Öğrenci üzerine kayıtlı olan bir TRC servisi yok
              </Chip>
            )}
          </AccordionItem>
          <AccordionItem
            key="6"
            aria-label="Vize Bilgileri"
            title="Vize Bilgileri"
          >
            <div className=" items-start justify-between gap-2 mt-2 flex lg:flex-row flex-col w-full h-auto ">
              <Input
                disabled
                type="text"
                label="Pasaport Numarası"
                variant="bordered"
                value={student.details.passport_no}
                className="lg:w-1/3 w-full dark"
                startContent={<GrStatusGoodSmall />}
              />
              <Input
                disabled
                type="text"
                label="Pasaportun Geçerli Olduğu Tarih"
                variant="bordered"
                value={student.details.passport_expire_date}
                className="lg:w-1/3 w-full dark"
                startContent={<GrStatusGoodSmall />}
              />
              <Input
                disabled
                type="text"
                label="Vize Randevu Tarihi"
                variant="bordered"
                value={student.details.visa_appointment_date}
                className="lg:w-1/3 w-full dark"
                startContent={<GrStatusGoodSmall />}
              />
            </div>
            <div className=" items-start justify-between gap-2 mt-2 flex flex-row w-full h-auto ">
              <Input
                disabled
                type="text"
                label="Vize Bitiş Tarihi"
                variant="bordered"
                value={student.details.visa_expiration_date}
                className="w-1/2 dark"
                startContent={<GrStatusGoodSmall />}
              />
              <Input
                disabled
                type="text"
                label="Vize Danışmanı"
                variant="bordered"
                value={student.details.visa_expert}
                className="w-1/2 dark"
                startContent={<FaUserCircle />}
              />
            </div>
          </AccordionItem>
          <AccordionItem key={"7"} aria-label="Dökümanlar" title="Dökümanlar">
            <div className="w-full h-auto items-center justify-center flex flex-wrap ">
              {student.docs?.passport?.length !== 0 && (
                <ViewDocument
                  documents={student.docs?.passport}
                  isDownloadable
                  header={"Pasaport"}
                />
              )}
              {student.docs?.accomodation?.length !== 0 && (
                <ViewDocument
                  documents={student.docs?.accomodation}
                  isDownloadable
                  header={"Konaklama"}
                />
              )}
              {student.docs?.trc?.length !== 0 && (
                <ViewDocument
                  documents={student.docs?.trc}
                  isDownloadable
                  header={"TRC"}
                />
              )}
              {student.docs?.visa?.length !== 0 && (
                <ViewDocument
                  documents={student.docs?.visa}
                  isDownloadable
                  header={"Vize "}
                />
              )}
              {student.docs?.university?.length !== 0 && (
                <ViewDocument
                  documents={student.docs?.university}
                  isDownloadable
                  header={"Üniversite"}
                />
              )}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
3;
