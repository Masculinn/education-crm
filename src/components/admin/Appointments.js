import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Tooltip,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { EyeIcon } from "../icons/EyeIcon";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { StudentDetails } from "../utils/StudentDetails";
import viewAllAppointments from "@/utils/db/adminQueries/viewAllAppointments";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import findStudent from "@/utils/db/adminQueries/findStudent";
import alertModal from "@/utils/assistants/alertModal";
import updateStudentAppointment from "@/utils/db/adminQueries/updateStudentAppointment";
import _ from "lodash";
import deleteAppointment from "@/utils/db/adminQueries/deleteAppointment";

const columns = [
  { name: "Öğrenci Bilgileri", uid: "student", sortable: true },
  { name: "Randevu Detayları", uid: "details", sortable: true },
  { name: "Randevu ID", uid: "appointment_id" },
  { name: "Randevu sahibi", uid: "staff", sortable: true },
  { name: "Edit", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["student", "staff", "details", "actions"];

export const Appointments = () => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [appointmentsdb, setAppointmentsdb] = useState([]);
  const [modalState, setModalState] = useState({
    stateName: null,
    key: null,
  });
  const [editedAppointment, setEditedAppointment] = useState({
    id: "",
    date: "",
    desc: "",
    hour: "",
    link: "",
    student_id: "",
    staff: "",
    student_avatar: "",
    student_email: "",
    student_name: "",
  });
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "student",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const student_appointments = await viewAllAppointments();

      if (student_appointments) {
        const appointmentsWithStudentDetails = await Promise.all(
          student_appointments.map(async (appointment) => {
            if (appointment.student_id) {
              const student = await findStudent(appointment.student_id);
              if (student) {
                return {
                  ...appointment,
                  student_avatar: student.avatar,
                  student_email: student.email,
                  student_name: student.name,
                };
              }
            }
            return appointment;
          })
        );
        setAppointmentsdb(appointmentsWithStudentDetails);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredAppointments = [...appointmentsdb];

    if (hasSearchFilter) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) =>
          appointment.student_name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          appointment.staff.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredAppointments;
  }, [filterValue, appointmentsdb]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // const findStudent = (id) =>
  //   appointmentsdb?.find((val) => val.student_id === id);

  const renderCell = useCallback((appointment, columnKey) => {
    const cellValue = appointment[columnKey];

    switch (columnKey) {
      case "student":
        return (
          <User
            avatarProps={{ radius: "lg", src: appointment?.student_avatar }}
            description={appointment?.student_email}
            name={appointment?.student_name}
            className="dark"
          >
            {appointment?.student_name}
          </User>
        );
      case "details":
        return (
          <div className="flex flex-col gap-1">
            <p className="text-bold text-sm capitalize">{appointment?.desc}</p>
            <p className="text-bold text-sm capitalize text-green-500">
              <span className=" text-sm">Tarih: </span>
              {appointment?.date} - {appointment?.hour}
            </p>
            <a
              className="text-bold pt-1 text-xs capitalize text-slate-500 items-center justify-start flex flex-row gap-2 max-w-max h-auto hover:text-white/80"
              href={appointment?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Randevu Bağlantısı</span>
              <FaArrowRight className="w-3 h-3 " />
            </a>
          </div>
        );
      case "appointment_id":
        return (
          <Chip
            color="success"
            variant="flat"
            className="transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            {appointment?.id}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <button
              className="w-auto h-auto"
              onClick={() => {
                setModalState({
                  stateName: "view",
                  key: appointment?.student_id,
                });
                onOpen();
              }}
            >
              <Tooltip content="Randevu Detayları" className="dark text-white">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
            </button>
            <button
              className="w-auto h-auto text-white"
              onClick={() => {
                setModalState({
                  stateName: "edit",
                  key: appointment?.id,
                });
                setEditedAppointment({
                  ...appointment,
                });
                onOpen();
              }}
            >
              <Tooltip content="Kayıdı Editle" className="dark text-white">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
            </button>
            <button
              onClick={() => {
                setModalState({
                  stateName: "delete",
                  key: appointment?.id,
                });
                onOpen();
              }}
              className="w-auto h-auto"
            >
              <Tooltip
                color="danger"
                content="Kayıtlı Randevuyu Sil"
                className="dark"
              >
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  });

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full h-auto items-center justify-start flex my-4 flex-row gap-4 text-white">
          <h2 className="lg:text-3xl text-2xl font-extrabold tracking-tighter">
            RANDEVU LİSTESİ
          </h2>
          <hr className="w-4/6 border border-slate-600 lg:block hidden" />
        </div>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Arayın..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown className="dark text-white">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<EditIcon />}>
              Öğrenciyi Düzenle
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Toplam {appointmentsdb?.length} randevu
          </span>
          <label className="flex items-center text-default-400 text-small">
            Sayfa başına satır sayısı:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    appointmentsdb.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="w-[30%] text-slate-500 text-sm  items-center justify-start hidden flex-row gap-2 lg:flex">
          Kayıtlı Randevu Listesi Gösteriliyor
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className="w-full justify-center self-center flex"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Önceki
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Sonraki
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const EditAppointment = () => {
    const handleConfirm = async () => {
      const checkEmptyValues = Object.values(updateAppointment).some(
        (val) => val === ""
      );
      const checkUpdates = _.isEqual(updateAppointment, editedAppointment);
      if (!checkUpdates) {
        if (!checkEmptyValues) {
          await updateStudentAppointment(
            {
              date: updateAppointment.date,
              desc: updateAppointment.desc,
              hour: updateAppointment.hour,
              link: updateAppointment.link,
              student_id: updateAppointment.student_id,
              staff: updateAppointment.staff,
            },
            updateAppointment.id
          );
        } else {
          alertModal({
            toastIcon: "error",
            toastTitle: "Randevu güncellenemedi: veriler boş bırakılmamalıdır.",
          });
        }
      } else {
        alertModal({
          toastIcon: "error",
          toastTitle:
            "Randevu güncellenemedi: herhangi bir değişiklik yapmadınız.",
        });
      }
    };
    const handleCancel = () => {
      onClose();
    };
    const [updateAppointment, setUpdateAppointment] = useState({
      ...editedAppointment,
    });

    return (
      <>
        <ModalHeader>
          <h2 className="w-full items-center justify-start flex flex-row gap-1 text-warning-400 tracking-tight">
            <EditIcon />
            <span>Randevuyu Editle</span>
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="w-full h-auto my-4  ">
            <div className="w-full items-center justify-center flex flex-row gap-1">
              <Input
                variant="bordered"
                type="time"
                color="warning"
                label="Randevu Saati"
                value={updateAppointment.hour}
                onChange={(e) => {
                  setUpdateAppointment((prev) => ({
                    ...prev,
                    hour: e.target.value,
                  }));
                }}
              />
              <Input
                variant="bordered"
                type="date"
                color="warning"
                label="Randevu Tarihi"
                value={updateAppointment.date}
                onChange={(e) => {
                  setUpdateAppointment((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }));
                }}
              />
              <Input
                type="text"
                variant="bordered"
                color="default"
                className="dark "
                label="Öğrenci Adı"
                value={updateAppointment.student_name}
                disabled
              />
            </div>
            <Input
              variant="bordered"
              type="text"
              color="warning"
              className="w-full h-auto dark pt-2"
              label="Randevu Linki & Adresi"
              value={updateAppointment.link}
              onChange={(e) => {
                setUpdateAppointment((prev) => ({
                  ...prev,
                  link: e.target.value,
                }));
              }}
            />
            <Textarea
              variant="bordered"
              color="warning"
              maxLength={240}
              className="dark pt-2"
              label="Açıklama"
              value={updateAppointment.desc}
              onChange={(e) => {
                setUpdateAppointment((prev) => ({
                  ...prev,
                  desc: e.target.value,
                }));
              }}
            />
          </div>
          <div className="w-full h-auto   overflow-scroll">
            <table className="w-full h-auto table-auto table">
              <tbody>
                <tr className="text-left">
                  <th className="text-base font-semibold tracking-tight text-slate-300">
                    Randevu Saati:
                  </th>
                  <td className="text-warning-500">{editedAppointment.hour}</td>
                  <td className="text-center">
                    <FaArrowRight className="text-slate-300" />
                  </td>
                  <td className="text-success-500 text-end">
                    {updateAppointment.hour}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="text-base font-semibold tracking-tight text-slate-300">
                    Randevu Tarihi:
                  </th>
                  <td className="text-warning-500">{editedAppointment.date}</td>
                  <td className="text-center">
                    <FaArrowRight className="text-slate-300" />
                  </td>
                  <td className="text-success-500 text-end">
                    {updateAppointment.date}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="text-base font-semibold tracking-tight text-slate-300">
                    Toplantı Linki & Adresi:
                  </th>
                  <td className="text-warning-500">{editedAppointment.link}</td>
                  <td className="text-center">
                    <FaArrowRight className="text-slate-300" />
                  </td>
                  <td className="text-success-500 text-end">
                    {updateAppointment.link}
                  </td>
                </tr>
                <tr className="text-left">
                  <th className="text-base font-semibold tracking-tight text-slate-300">
                    Randevu Açıklaması:
                  </th>
                  <td className="text-warning-500">{editedAppointment.desc}</td>
                  <td className="text-center">
                    <FaArrowRight className="text-slate-300" />
                  </td>
                  <td className="text-success-500 text-end">
                    {updateAppointment.desc}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="dark"
            color="primary"
            onPress={handleCancel}
            variant="flat"
          >
            İptal
          </Button>
          <Button
            className="dark"
            color="success"
            onPress={handleConfirm}
            variant="flat"
          >
            Değişiklikleri Onayla
          </Button>
        </ModalFooter>
      </>
    );
  };

  const ViewStudent = () => {
    return (
      <ModalBody>
        <StudentDetails student_id={modalState.key} />
      </ModalBody>
    );
  };

  const DeleteAppointment = () => {
    const handleDelete = async () =>
      await deleteAppointment(modalState.key).finally(() => {
        onClose();
        const updateApp = appointmentsdb.filter(
          (val) => val.id !== modalState.key
        );
        setAppointmentsdb(updateApp);
      });
    return (
      <>
        <ModalHeader>
          <h2 className="w-full items-center justify-start flex flex-row gap-1 text-danger-400 tracking-tight">
            <DeleteIcon />
            <span>Randevuyu Sil</span>
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="w-full h-auto items-center justify-center flex flex-row gap-1">
            <span>Seçtiğiniz</span>{" "}
            <Chip className="dark" color="success" size="md" variant="flat">
              {modalState.key}
            </Chip>{" "}
            <span>kayıtlı bu randevuyu silmek istiyor musunuz?</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onClick={onClose}>
            İptal
          </Button>
          <Button color="danger" variant="flat" onClick={handleDelete}>
            Öğrenci Kaydını Sil
          </Button>
        </ModalFooter>
      </>
    );
  };

  const ModalView = () => {
    switch (modalState?.stateName) {
      case "edit":
        return <EditAppointment />;
      case "view":
        return <ViewStudent />;
      case "delete":
        return <DeleteAppointment />;
      default:
        return;
    }
  };

  if (loading) {
    return <LoadingSkeleton isWidthFull mode={"table"} />;
  }

  return (
    <>
      <div className="w-full h-auto rounded-2xl mb-8">
        <div className="flex flex-col gap-3">
          <Table
            aria-label="Randevu Listesi"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            className="dark"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(c) => (
                <TableColumn
                  key={c.uid}
                  align={
                    c.uid === "actions"
                      ? "center"
                      : "start" || c.uid === "details"
                      ? "start"
                      : "center"
                  }
                  allowsSorting={columns.sortable}
                >
                  {c.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sortedItems} emptyContent={"Randevu Bulunamadı"}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
        classNames={{
          base: "bg-slate-950",
        }}
        size="xl"
        className="dark text-slate-200"
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <ModalView />
        </ModalContent>
      </Modal>
    </>
  );
};
