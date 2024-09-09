import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Tooltip,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import viewAllStudents from "@/utils/db/adminQueries/viewAllStudents";
import { StudentDetails } from "../utils/StudentDetails";
import alertModal from "@/utils/assistants/alertModal";
import editStudentRegistration from "@/utils/db/adminQueries/editStudentRegistration";
import deleteStudent from "@/utils/db/adminQueries/deleteStudent";

const statusColorMap = {
  onaylanmış: "success",
  onaylanmamış: "danger",
  beklemede: "warning",
};

const columns = [
  { name: "İsim", uid: "name", sortable: true },
  { name: "Bölüm", uid: "university", sortable: true },
  { name: "Durum", uid: "status", sortable: true },
  { name: "Aksiyonlar", uid: "actions" },
];

const statusOptions = [
  { name: "Onaylanmış", uid: "onaylanmış" },
  { name: "Beklemede", uid: "beklemede" },
  { name: "Reddedilmiş", uid: "reddedilmiş" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "university", "status", "actions"];

export default function RegisterConfirmation() {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [modalState, setModalState] = useState({
    stateName: null,
    user_id: null,
  });
  const [studentList, setStudentList] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...studentList];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [studentList, filterValue, statusFilter]);

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

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await viewAllStudents("*").finally(() =>
        setLoading(false)
      );
      if (students) {
        setStudentList(students);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const findStudent = (id) => {
    return studentList?.find((val) => val?.id === id);
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
            className="dark"
          >
            {user.email}
          </User>
        );
      case "university":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.program}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
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
                  user_id: user.id,
                });
                onOpen();
              }}
            >
              <Tooltip content="Öğrenci Detayları" className="dark text-white">
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
                  user_id: user.id,
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
                  user_id: user.id,
                });
                onOpen();
              }}
              className="w-auto h-auto"
            >
              <Tooltip
                color="danger"
                content="Öğrenci Kaydını Sil"
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
        <div className="w-full h-auto items-center justify-start flex mb-4 -mt-2 flex-row gap-4 text-white">
          <hr className="w-4/6 border border-white hidden lg:block" />
          <h2 className="lg:text-3xl text-2xl font-extrabold tracking-tighter">
            KAYIT ONAY LISTESI
          </h2>
        </div>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="İsime Göre Arayın..."
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
                  Durum
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Toplam {studentList?.length} kayıtlı öğrenci
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
    studentList?.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="w-[30%] text-slate-500 text-sm  items-center justify-start flex-row gap-2 lg:flex hidden">
          Kayıt Onayı Listesi Gösteriliyor
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className={`w-full justify-center self-center flex`}
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

  const EditModal = () => {
    const updateStatus = async (status) => {
      const newStatusMap = {
        confirm: "onaylanmış",
        reject: "onaylanmamış",
        await: "beklemede",
      };

      const newStatus = newStatusMap[status];

      if (!newStatus) return;

      const changeStatus = await editStudentRegistration(
        modalState.user_id,
        newStatus
      );

      setStudentList((prevList) =>
        prevList.map((student) =>
          student.id === modalState.user_id
            ? { ...student, status: newStatus }
            : student
        )
      );
      alertModal({
        toastIcon: "success",
        toastTitle: "Öğrenicinin kayıt durumu başarıyla değiştirildi.",
      });
    };

    return (
      <>
        <ModalHeader>
          <div className="items-center justify-between flex flex-row w-full h-auto pt-8 -mb-8">
            <User
              name={findStudent(modalState.user_id).name}
              description={findStudent(modalState.user_id).email}
              className="dark"
              avatarProps={{
                src: findStudent(modalState.user_id).avatar,
              }}
            />
            <Chip
              color="success"
              size="lg"
              className="cursor-pointer hover:scale-105 transition duration-200"
              variant="flat"
            >
              <code>#{modalState.user_id}</code>
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="w-full items-start justify-start mt-8 flex flex-col gap-3 h-auto">
            <div className="items-center justify-center flex flex-row gap-2">
              <span>Öğrencinin güncel kayıt durumu</span>{" "}
              <Chip
                variant="flat"
                className="dark"
                color={statusColorMap[findStudent(modalState.user_id).status]}
              >
                {findStudent(modalState.user_id).status}
              </Chip>
            </div>
          </div>
          <h2>
            Öğrenci kayıdında değişiklik yapmak için lütfen aşağıdaki butonları
            kullanın.
          </h2>
        </ModalBody>
        <ModalFooter className="items-center justify-end flex flex-row w-full h-auto text-white my-4">
          <Button
            color="success"
            variant="flat"
            className="dark text-white px-8 text-md"
            onClick={() => updateStatus("confirm")}
          >
            Onayla
          </Button>
          <Button
            color="warning"
            variant="flat"
            className="text-white px-8 text-md"
            onClick={() => updateStatus("await")}
          >
            Beklemeye Al
          </Button>
          <Button
            color="danger"
            variant="flat"
            className="px-8 text-md"
            onClick={() => updateStatus("reject")}
          >
            Reddet
          </Button>
        </ModalFooter>
      </>
    );
  };

  const DetailModal = () => {
    return (
      <ModalBody>
        <StudentDetails student_id={findStudent(modalState.user_id).id} />
      </ModalBody>
    );
  };

  const DeleteUser = () => {
    const findNameById = (id) => {
      return studentList.find((data) => data.id === id);
    };

    const handleDelete = async () => {
      onClose();
      const del = await deleteStudent(modalState.user_id);
      const newStudentList = studentList.filter(
        (data) => data.id !== modalState.user_id
      );
      setStudentList(newStudentList);
      alertModal({
        toastIcon: "success",
        toastTitle: `${modalState.user_id} üzerine kayıtlı öğrenci silindi.`,
      });
    };

    return (
      <>
        <ModalHeader>
          <div className="w-full h-auto items-center justify-start flex flex-row gap-2 text-rose-600 text-lg font-bold">
            <DeleteIcon className="w-6 h-6" />
            <h2>Öğrenci Sil</h2>
          </div>
        </ModalHeader>
        <ModalBody className="p-8">
          <h2>
            <code className="text-amber-300">
              #{findStudent(modalState.user_id)?.id}
            </code>{" "}
            ID'si üzerine kayıtlı
            <span className="text-amber-300">
              {" "}
              {findNameById(modalState.user_id)?.name}
            </span>{" "}
            isimli öğrencinin kaydını Olympos Portaldan kaldırmak istiyor
            musunuz?
          </h2>
          <div className="w-full h-auto mt-4 items-center justify-end flex flex-row text-white gap-3">
            <Button color="danger" onClick={handleDelete}>
              Öğrenci Kaydını Sil
            </Button>
          </div>
        </ModalBody>
      </>
    );
  };

  if (loading) {
    return <LoadingSkeleton isWidthFull mode={"table"} />;
  }

  const ModalView = () => {
    switch (modalState.stateName) {
      case "edit":
        return <EditModal />;
      case "view":
        return <DetailModal />;
      case "delete":
        return <DeleteUser />;
      default:
        return;
    }
  };

  return (
    <>
      <div
        className={`w-full h-auto items-center justify-end gap-4  flex flex-row `}
      >
        <div className="w-full  rounded-2xl h-auto items justify-start flex-col flex ">
          <div className="flex flex-col gap-3 mt-7">
            <Table
              aria-label="Öğrenci Listesi"
              isHeaderSticky
              className="dark"
              topContent={topContent}
              bottomContentPlacement="outside"
              selectedKeys={selectedKeys}
              sortDescriptor={sortDescriptor}
              onSelectionChange={setSelectedKeys}
              onSortChange={setSortDescriptor}
              classNames={{
                wrapper: "max-h-[382px]",
              }}
              selectionMode="none"
              topContentPlacement="outside"
              bottomContent={bottomContent}
            >
              <TableHeader columns={headerColumns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={sortedItems}
                emptyContent={"Kayıt Onayı Bekleyen Öğrenci Bulunamadı"}
              >
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
}
