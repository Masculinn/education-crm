import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Divider,
  Textarea,
} from "@nextui-org/react";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import findAdmins from "@/utils/db/adminQueries/findAdmins";
import viewProfit from "@/utils/db/adminQueries/finance_module/viewProfit";
import { Inter } from "next/font/google";
import { IoWarningOutline } from "react-icons/io5";
import { EyeIcon } from "../icons/EyeIcon";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";
import alertModal from "@/utils/assistants/alertModal";
import updateFinanceReport from "@/utils/db/adminQueries/finance_module/updateFinanceReport";
import deleteFinanceReport from "@/utils/db/adminQueries/finance_module/deleteFinanceReport";

const font = Inter({
  subsets: ["latin"],
});

const columns = [
  { name: "KAYITLAYAN", uid: "authorID", sortable: true },
  { name: "RAPOR BAŞLIĞI", uid: "header", sortable: true },
  { name: "TUTAR", uid: "cost", sortable: false },
  { name: "TARİH", uid: "date", sortable: true },
  { name: "RAPOR NOTU", uid: "note", sortable: false },
  { name: "KATEGORİ", uid: "mode", sortable: true },
  { name: "RAPOR ID", uid: "id", sortable: true },
  { name: "Aksiyonlar", uid: "actions" },
];

const modeOptions = [
  { name: "Gelir", uid: "income" },
  { name: "Gider", uid: "expense" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "authorID",
  "header",
  "cost",
  "mode",
  "actions",
];
export const FinanceTable = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [reports, setReports] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "cost",
    direction: "ascending",
  });
  const [modalState, setModalState] = useState({
    stateName: null,
    report_id: null,
  });
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const reports = await viewProfit("*");
      const admins = await findAdmins("", "FIND_ALL", "").finally(() =>
        setLoading(false)
      );

      if (reports && admins) {
        const modifiedReports = reports.map((item) => ({
          ...item,
          mode: item.mode ? "income" : "expense",
        }));
        setReports(modifiedReports);
        setAdminList(admins);
      }
    };

    fetchData();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((c) => Array.from(visibleColumns).includes(c.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredReports = reports.length > 0 ? [...reports] : [];
    if (hasSearchFilter) {
      filteredReports = filteredReports.filter((val) => {
        const isValueName = adminList?.find((x) => x.id === val.authorID);
        return (
          val.header.toLowerCase().includes(filterValue.toLowerCase()) ||
          isValueName?.name?.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== modeOptions.length
    ) {
      console.log(filteredReports);
      filteredReports = filteredReports.filter((val) =>
        Array.from(statusFilter).includes(val.mode)
      );
    }
    return filteredReports;
  }, [reports, filterValue, statusFilter, adminList, hasSearchFilter]);

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

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
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
  }, []);

  const renderCell = useCallback(
    (report, columnKey) => {
      const cellValue = report[columnKey];

      switch (columnKey) {
        case "authorID":
          const author = adminList?.find((val) => val.id === cellValue);
          return (
            <User
              avatarProps={{ radius: "full", src: author?.avatar }}
              description={author?.email}
              name={author?.name}
            >
              {author?.email}
            </User>
          );
        case "mode":
          return (
            <Chip
              color="default"
              variant="flat"
              size="md"
              className="dark capitalize items-center justify-center flex gap-1"
              startContent={
                <>
                  {cellValue === "income" ? (
                    <div className="text-success-400 flex gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="text-danger-400 flex gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    </div>
                  )}
                </>
              }
            >
              <span>{cellValue === "income" ? "Gelir" : "Gider"}</span>
            </Chip>
          );
        case "cost":
          return (
            <span
              className={` font-semibold text-md ${
                report.mode === "income"
                  ? "text-success-400"
                  : "text-danger-400"
              } `}
            >
              {cellValue} €
            </span>
          );
        case "id":
          return (
            <Chip color="success" variant="flat">
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2 ">
              <button
                className="w-auto h-auto"
                onClick={() => {
                  setModalState({
                    stateName: "view",
                    report_id: report.id,
                  });
                  onOpen();
                }}
              >
                <Tooltip content="Rapor Detayları" className="dark text-white">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Tooltip>
              </button>
              <button
                className="w-auto h-auto"
                onClick={() => {
                  setModalState({
                    stateName: "edit",
                    report_id: report.id,
                  });
                  onOpen();
                }}
              >
                <Tooltip
                  content="Rapor Kaydını Editle"
                  className="dark text-white"
                >
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
              </button>
              <button
                className="w-auto h-auto"
                onClick={() => {
                  setModalState({
                    stateName: "delete",
                    report_id: report.id,
                  });
                  onOpen();
                }}
              >
                <Tooltip
                  color="danger"
                  content="Raporu Sil"
                  className="dark text-white"
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
    },
    [adminList]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="İsime veya başlığa göre arayın"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
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
                {modeOptions.map((s) => (
                  <DropdownItem key={s.uid} className="capitalize">
                    {s.name}
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
                  Veriler
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
            Toplam {reports.length} kayıtlı rapor
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
    reports.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="w-[30%] text-slate-500 text-sm  items-center justify-start lg:flex hidden flex-row gap-2">
          Kayıtlı Rapor Listesi Gösteriliyor
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          className="w-full justify-center self-center flex"
          color="primary"
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

  const ModalView = () => {
    const findReport = reports.find((val) => val.id === modalState.report_id);
    const findAuthor = adminList.find((val) => val.id === findReport.authorID);
    const [financeData, setFinanceData] = useState({
      id: findReport.id,
      authorID: findAuthor.id,
      header: findReport.header,
      cost: findReport.cost,
      note: findReport.note,
      date: findReport.date,
      mode: findReport.mode,
    });
    const [errorLog, setErrorlog] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleDeleteReport = async () => {
      const res = await deleteFinanceReport({ id: financeData.id });
      if (res) {
        setReports((prev) => prev.filter((val) => val.id !== financeData.id));
        alertModal({
          toastIcon: "success",
          toastTitle: "Rapor Başarıyla Silindi",
        });
        onClose();
        setModalState({ stateName: "", report_id: "" });
      }
    };

    const handleSaveChanges = async () => {
      if (
        financeData.cost === "" ||
        financeData.header === "" ||
        financeData.note === ""
      ) {
        setErrorlog(true);
        setErrorMsg("Veriler boş bırakılmamalıdır");
      } else {
        if (
          Object.entries(financeData).every(([k, v]) => v === findReport[k])
        ) {
          setErrorlog(true);
          setErrorMsg("Raporda herhangi bir değişiklik yapmadınız.");
        } else {
          const newFinanceData = {
            ...financeData,
            mode: financeData.mode === "income" ? 1 : 0,
          };
          const updated = await updateFinanceReport({
            id: financeData.id,
            ...newFinanceData,
          }).finally(() => {
            setModalState({ stateName: "", report_id: "" });
            onClose();
          });

          if (updated) {
            setReports((prev) => [
              ...prev.filter((val) => val.id !== financeData.id),
              financeData,
            ]);
            alertModal({
              toastIcon: "success",
              toastTitle: `Rapor başarıyla güncellendi!`,
            });
          }
          setErrorlog(false);
        }
      }
    };
    switch (modalState.stateName) {
      case "delete":
        return (
          <>
            <ModalHeader>Rapor Kaldırma</ModalHeader>
            <ModalBody>
              <p className="w-full h-auto leading-tight">
                <code className="text-amber-400 tracking-tighter">
                  {findAuthor.name}{" "}
                </code>
                kişisinin yazdığı{" "}
                <Chip color="success" variant="flat">
                  <code>{findReport.id}</code>
                </Chip>{" "}
                Numaralı ve
                <code className="text-amber-400 tracking-tighter">
                  {" "}
                  {findReport.header}{" "}
                </code>
                başlıklı raporu silmek istiyor musunuz?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={handleDeleteReport}
              >
                Raporu Sil
              </Button>
            </ModalFooter>
          </>
        );
      default:
        return (
          <>
            <ModalHeader
              className={`items-center justify-between flex flex-row w-full px-8 pt-8 h-auto dark tracking-tight ${font.className}`}
            >
              <User
                name={findAuthor.name}
                description={findAuthor.perms[0]}
                className="scale-110"
                avatarProps={{
                  src: findAuthor.avatar,
                }}
              />
              {modalState.stateName !== "view" ? (
                <EditIcon className="w-8 h-8 text-warning-500" />
              ) : (
                <EyeIcon className="w-8 h-8 text-success-500" />
              )}
            </ModalHeader>
            <ModalBody className="w-full max-h-[80vh] min-h-min overflow-y-scroll dark">
              <Divider
                orientation="horizontal"
                className="border-white dark my-1 "
              />
              <div className="items-center justify-between flex flex-row w-full h-auto my-1">
                <h2 className=" text-lg font-semibold tracking-tighter  ">
                  {modalState.stateName === "view"
                    ? "Rapor Bilgileri"
                    : "Rapor Bilgilerini Düzenle"}
                </h2>
              </div>
              <div className="w-full items-center justify-center flex flex-row gap-2 ">
                <Input
                  disabled={modalState.stateName === "view"}
                  color={financeData.mode === "income" ? "success" : "danger"}
                  type="text"
                  label="Rapor Tipi"
                  variant="bordered"
                  value={financeData.mode === "income" ? "Gelir" : "Gider"}
                  className={`w-1/3 dark font-bold ${
                    financeData.mode === "income"
                      ? "text-success-400"
                      : "text-danger-400"
                  }`}
                  startContent={
                    financeData.mode === "income" ? (
                      <div className="text-success-400 flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-danger-400 flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          />
                        </svg>
                      </div>
                    )
                  }
                />
                <Input
                  disabled
                  color="success"
                  type="text"
                  label="Rapor ID"
                  variant="bordered"
                  value={financeData.id}
                  className="w-1/3 dark"
                />
                <Input
                  disabled
                  color="success"
                  type="text"
                  label="Rapor Tarihi"
                  variant="bordered"
                  value={financeData.date}
                  className="w-1/3 dark"
                />
              </div>
              <div className="items-center justify-center flex w-full flex-row gap-2">
                <Input
                  disabled={modalState.stateName === "view"}
                  color="success"
                  type="text"
                  label="Rapor Başlığı"
                  variant="bordered"
                  onChange={(e) => {
                    setFinanceData((prev) => ({
                      ...prev,
                      header: e.target.value,
                    }));
                  }}
                  value={financeData.header}
                  className="w-2/3 dark"
                />
                <Input
                  disabled={modalState.stateName === "view"}
                  color="success"
                  type="number"
                  inputMode="numeric"
                  label="Tutar"
                  variant="bordered"
                  value={financeData.cost}
                  className="w-1/3 dark"
                  startContent={
                    <span className="justify-self-auto text-sm">€</span>
                  }
                  onChange={(e) => {
                    setFinanceData((prev) => ({
                      ...prev,
                      cost: e.target.value,
                    }));
                  }}
                />
              </div>
              <div
                className={`w-full items-center justify-center flex flex-row ${
                  modalState.stateName === "view" && "pb-8"
                }`}
              >
                <Textarea
                  variant="bordered"
                  color="success"
                  label="Rapor Notu"
                  value={financeData.note}
                  className="w-full h-auto"
                  disabled={modalState.stateName === "view"}
                  onChange={(e) => {
                    setFinanceData((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }));
                  }}
                />
              </div>
            </ModalBody>
            {modalState.stateName === "edit" && (
              <ModalFooter className="flex w-full h-auto flex-col">
                {errorLog && (
                  <div className="w-full h-auto items-center justify-start flex flex-row gap-1 -mt-3 text-warning-500 tracking-tighter text-sm">
                    <IoWarningOutline className="h-5 w-5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="items-center justify-end flex flex-row gap-2">
                  <Button
                    color="warning"
                    variant="flat"
                    size="md"
                    onPress={() => {
                      setFinanceData((prev) => ({
                        ...prev,
                        cost: findReport.cost,
                        header: findReport.header,
                        note: findReport.note,
                      }));
                    }}
                  >
                    Değişiklikleri Temizle
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    size="md"
                    onClick={handleSaveChanges}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </ModalFooter>
            )}
          </>
        );
    }
  };

  if (loading) {
    return <LoadingSkeleton mode="table" isWidthFull />;
  }
  return (
    <>
      <div className="w-full h-auto items-center justify-start flex mb-4 -mt-2 flex-row gap-4 text-white">
        <h2 className="lg:text-3xl text-2xl font-extrabold tracking-tighter lg:w-2/6 w-3/6">
          Rapor Tablosu
        </h2>
        <hr className="w-4/6 border border-white lg:block hidden" />
      </div>
      <Table
        aria-label="Tutar Çetelesi"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        className={` ${font.className} dark`}
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
          {(column) => (
            <TableColumn
              key={column.uid}
              align="center"
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Rapor Bulunamadı"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
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
