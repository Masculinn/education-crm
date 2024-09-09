import { Inter } from "next/font/google";
import {
  Chip,
  Input,
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import studentSidebar from "@/lib/studentSidebar";
import adminSidebar from "@/lib/adminSidebar";
import { setComponentNumber } from "@/stores/slices/componentSlice";

const headerFont = Inter({
  subsets: ["latin"],
});

const LayoutCard = ({ children, layoutTitle }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { auth } = useSelector((state) => state.login);
  const isResponsive = useMediaQuery({ query: "(max-width: 768px)" });
  const [isRes, setIsRes] = useState(null);
  const [search, setSearchValue] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsRes(isResponsive);
  }, [isResponsive]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (search !== "") {
      if (auth === "student") {
        const filtered = studentSidebar.filter((item) => {
          const itemHas = item.name.meta
            .toLowerCase()
            .includes(search.toLowerCase());
          if (itemHas) {
            const { meta, ...otherKeys } = item.name;
            return {
              ...otherKeys,
            };
          }
        });
        search !== "" ? setFilteredLinks(filtered) : [];
      } else if (auth === "admin") {
        const filtered = adminSidebar.filter((item) => {
          const itemHas = item.name?.meta
            ?.toLowerCase()
            .includes(search.toLowerCase());

          if (itemHas) {
            const { meta, ...otherKeys } = item.name;
            return {
              ...otherKeys,
            };
          }
        });
        search !== "" ? setFilteredLinks(filtered) : [];
      }
    }
  }, [search]);

  return (
    <div
      className={`lg:p-12  pt-8 w-full rounded-2xl tracking-tight ${headerFont.className}`}
    >
      <div className="w-full flex-row z-50 justify-between h-24 lg:gap-0 gap-4 flex items-center self-center bg-transparent px-4 rounded-xl -mt-6">
        <Chip
          color="primary"
          variant="shadow"
          className="dark lg:text-xl text-lg lg:p-6 p-5"
        >
          <h3 className="font-bold">{layoutTitle}</h3>
        </Chip>
        <div className=" h-auto w-auto items-center justify-center flex flex-row gap-3">
          {!isRes ? (
            <Input
              placeholder="Arayın..."
              type="text"
              onClick={onOpen}
              color="primary"
              className="dark lg:w-72 text-white lg:flex hidden"
              startContent={<IoSearch className="w-4 h-4 self-center" />}
            />
          ) : (
            <Badge shape="circle" color="danger" className="dark">
              <Button
                radius="full"
                isIconOnly
                aria-label="Settings Badge"
                variant="light"
                onClick={onOpen}
              >
                <IoSearch className="w-8  h-8 p-1 rounded-full text-white" />
              </Button>
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full overflow-y-scroll overflow-x-hidden rounded-xl h-auto lg:p-4 lg:-ml-0 -ml-2 p-2 grid gap-4 grid-cols-2 ">
        {children}
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
        size="3xl"
        className="dark text-slate-200"
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        classNames={{
          closeButton: "hidden",
        }}
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
          {(onClose) => (
            <>
              <ModalBody>
                <div className="w-full h-full py-8 px-6">
                  <Input
                    placeholder="Arayın..."
                    type="text"
                    className="dark w-full text-white"
                    value={search}
                    onChange={handleSearchChange}
                    endContent={
                      <Button
                        variant="solid"
                        color="primary"
                        className="-mr-4"
                        size="md"
                      >
                        <IoSearch className="w-4 h-4 self-center" />
                      </Button>
                    }
                  />
                  <div className="w-full  py-4 rounded-2xl h-auto items-start justify-start flex flex-col gap-1.5 transition-all duration-200">
                    {filteredLinks.length > 0 &&
                      filteredLinks.map((item, idx) => (
                        <button
                          className="rounded-xl w-full h-14 px-8 py-2 bg-transparent text-white  border-stone-800 transition-all duration-200 hover:border-sky-600 border-2 items-center justify-between flex flex-row"
                          key={idx}
                          onClick={() => {
                            onClose();
                            dispatch(
                              setComponentNumber({
                                no: item.name.stateName,
                              })
                            );
                          }}
                        >
                          <span className="w-auto h-auto capitalize font-bold tracking-tighter text-xl">
                            {item.name.title}
                          </span>
                          <span className="w-auto h-auto">{item.name.ico}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export { LayoutCard };
