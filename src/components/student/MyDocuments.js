import { IoMdDocument } from "react-icons/io";
import { Inter } from "next/font/google";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination, Navigation } from "swiper/modules";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useTrail, animated } from "@react-spring/web";
import { CgInfo } from "react-icons/cg";
import viewStudentDocuments from "@/utils/db/viewStudentDocuments";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "../icons/PlusIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import idGenerator from "@/utils/assistants/idGenerator";
import uploadDocument from "@/utils/db/addStudentDocuments";
import alertModal from "@/utils/assistants/alertModal";
import config_documents from "@/config/config_documents";
import dynamic from "next/dynamic";
import { pdfjs } from "react-pdf";
import { Error } from "../utils/Error";
import { IoCloudDownloadSharp } from "react-icons/io5";
import deleteStudentDocument from "@/utils/db/deleteStudentDocument";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});
const font = Inter({
  subsets: ["latin"],
});

export default function MyDocuments() {
  const { id } = useSelector((state) => state.login);
  const { action } = useSelector((state) => state.studentProfileActions);
  const { state } = useSelector((state) => state.responsive);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const [view, setView] = useState(null);
  const [media, setMedia] = useState({
    passport: [],
    visa: [],
    trc: [],
    accommodation: [],
    university: [],
  });
  const [documentAction, setDocumentAction] = useState({
    state: null,
    type: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);

  const handleStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    const viewExistedDocuments = async () => {
      setLoading(true);
      const existedDocs = await viewStudentDocuments(id).finally(() => {
        setLoading(false);
      });
      setMedia({
        passport: existedDocs?.passport,
        accommodation: existedDocs?.accommodation,
        visa: existedDocs?.visa,
        trc: existedDocs?.trc,
        university: existedDocs?.university,
      });
    };
    viewExistedDocuments();
  }, [id, selectedFile, deleteFile]);

  useEffect(() => {
    const processDocumentUpload = async () => {
      setLoading(true);
      const fileExt = selectedFile?.name?.split(".").pop();
      const fileName = `${idGenerator(32)}.${fileExt}`;
      const updateDocuments = await uploadDocument(
        id,
        fileName,
        selectedFile,
        documentAction?.type,
        dispatch
      ).finally(() => {
        setLoading(false);
      });

      if (updateDocuments) {
        alertModal({
          toastIcon: "success",
          toastTitle: "Dökümanınız Yüklendi!",
        });

        setMedia((prev) => ({
          ...prev,
          [documentAction.type]: [
            ...prev[documentAction.type],
            updateDocuments.publicUrl,
          ],
        }));
      }
    };

    processDocumentUpload();
  }, [selectedFile]);

  const UploadDocuments = () => {
    return (
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>
              <h2 className="text-success-500 font-bold text-xl tracking-tighter items-center justify-center flex flex-row-reverse gap-2">
                <span>Eklenecek Döküman Türü</span>
                <IoMdDocument className="w-5 h-5 " />
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className="w-full h-auto items-center justify-start flex flex-wrap gap-3 ">
                {Object.entries(config_documents).map(([key, val], idx) => (
                  <div className="relative w-full" key={idx}>
                    <input
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      label={val + " Yükle"}
                      type="file"
                      id={key}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={(e) => {
                        setDocumentAction({ state: "add", type: key });
                        if (!e.target.files || e.target.files.length === 0) {
                          alertModal({
                            toastIcon: "error",
                            toastTitle: "Dosya Seçilemedi",
                          });
                        } else {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                        }
                        onclose();
                      }}
                    />
                    <label
                      htmlFor={key}
                      className="inline-block w-full py-3 px-4 text-center text-white bg-transparent border border-white rounded-lg shadow-sm cursor-pointer hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                      {val + " Yükle"}
                    </label>
                  </div>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    );
  };

  const confirmDelete = async () => {
    try {
      if (deleteFile && documentAction.state === "delete") {
        await deleteStudentDocument(id, deleteFile, dispatch).finally(() => {
          setDeleteFile(null);
        });
      }
    } catch (error) {
      alertModal({
        toastIcon: "error",
        toastTitle: `Error deleting document: ${error}`,
      });
    }
  };

  const RemoveDocuments = () => {
    return (
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>
              <h2 className="text-rose-500 font-bold text-xl tracking-tighter items-center justify-center flex flex-row-reverse gap-2">
                <span>Dökümanı Sil</span> <IoMdDocument className="w-5 h-5 " />
              </h2>
            </ModalHeader>
            <ModalBody>
              Dikkat bu döküman kalıcı olarak silinecektir. Dökümanı silmeyi
              onaylıyor musunuz?
            </ModalBody>
            <ModalFooter>
              <Button
                className="dark"
                color="primary"
                variant="solid"
                onPress={onclose}
              >
                İptal
              </Button>
              <Button
                className="dark"
                color="danger"
                variant="solid"
                onPress={() => {
                  confirmDelete();
                  onclose();
                }}
              >
                Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    );
  };

  const downloadFile = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url.split("/").pop();
    anchor.target = "_blank";
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.click();
  };

  const trail = useTrail(Object.keys(media).length, {
    opacity: step === 0 ? 1 : 0,
    transform: step === 0 ? "translateY(0)" : "translateY(20px)",
    from: { opacity: 0, transform: "translateY(20px)" },
  });

  return (
    <>
      <div className="w-full h-full items-start justify-start flex flex-col">
        <div className="w-full h-auto items-center justify-between  flex pt-2">
          {step !== 0 && (
            <Button
              color="primary"
              variant="bordered"
              className="dark"
              type="button"
              size="sm"
              onPress={handleBack}
            >
              <FaArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h2 className="flex self-center font-extrabold text-2xl tracking-tighter ">
            {step === 0 ? "Döküman Görüntüleyici" : config_documents[view]}
          </h2>
        </div>
        {step === 0 && (
          <ul className="w-full h-full bg-transparent rounded-2xl mt-4 flex flex-wrap">
            <li
              className="list-none text-lg w-1/2 lg:h-1/3 h-full items-center justify-center flex rounded-2xl capitalize bg-cover bg-center scale-90"
              style={{ backgroundImage: "url(edu-logo.png)" }}
            ></li>
            {trail.map((props, idx) => {
              const arr = Object.keys(media)[idx];
              const key = config_documents[arr];
              return (
                <animated.button
                  key={idx}
                  onClick={() => {
                    handleStep();
                    setView(arr);
                  }}
                  style={{ ...props, scale: 0.9 }}
                  className="list-none bg-gradient-to-br shadow-lg text-lg w-1/2 lg:h-1/3 h-full from-slate-800 to-bg-white scale-90 items-center justify-center flex rounded-2xl capitalize font-extrabold tracking-tight hover:to-rose-600"
                >
                  {key}
                </animated.button>
              );
            })}
          </ul>
        )}

        {step !== 0 && (
          <div className="w-full h-full bg-transparent rounded-2xl lg:mt-4 my-8  flex flex-col">
            {!media[view] || media[view]?.length <= 0 ? (
              <Error
                errorNote={"Döküman Bulunamadı"}
                header={"Oops..."}
                style={"mt-16 lg:mt-0"}
              />
            ) : (
              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                keyboard={{ enabled: true }}
                modules={[SwiperPagination, Navigation]}
                pagination={{ clickable: true }}
                navigation={{ enabled: true }}
                effect="slide"
                className="w-full h-full rounded-2xl scale-80"
              >
                {media[view]?.map((val, idx) => (
                  <SwiperSlide key={idx} className="w-full h-full rounded-2xl">
                    <div className="w-full relative h-full bg-transparent items-center justify-center flex flex-col tracking-tight">
                      {val.endsWith(".pdf") ? (
                        <div className="w-full h-auto">
                          <Document
                            file={val}
                            className={"h-72 w-96 rounded-xl"}
                          >
                            <Page
                              pageNumber={1}
                              width={400}
                              height={200}
                              className={"rounded-xl"}
                            />
                          </Document>
                          <div className="absolute bottom-4 right-4 items-center justify-center flex flex-row gap-2 z-50  cursor-pointer">
                            <Button
                              color="success"
                              variant="solid"
                              className="dark text-white"
                              onClick={() => downloadFile(val)}
                            >
                              <IoCloudDownloadSharp className="w-5 h-5" />
                            </Button>
                            <Button
                              color="danger"
                              variant="solid"
                              className="dark"
                              onClick={() => {
                                setDeleteFile(val);
                                setDocumentAction((prev) => ({
                                  ...prev,
                                  state: "delete",
                                }));
                                onOpen();
                              }}
                            >
                              <DeleteIcon className={"w-5 h-5"} />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Zoom zoomMargin={24}>
                          <div className="w-full h-auto">
                            <Image
                              width={400}
                              alt="Belge Resmi"
                              src={val}
                              className="object-cover object-center cursor-pointer dark"
                            />
                            <div className="absolute bottom-4 right-4 items-center justify-center flex flex-row gap-2 z-50 cursor-pointer">
                              <Button
                                color="success"
                                variant="solid"
                                className="dark text-white"
                                onClick={() => downloadFile(val)}
                              >
                                <IoCloudDownloadSharp className="w-5 h-5" />
                              </Button>
                              <Button
                                color="danger"
                                variant="solid"
                                className="dark"
                                onClick={() => {
                                  setDeleteFile(val);
                                  setDocumentAction((prev) => ({
                                    ...prev,
                                    state: "delete",
                                  }));
                                  onOpen();
                                }}
                              >
                                <DeleteIcon className={"w-5 h-5"} />
                              </Button>
                            </div>
                          </div>
                        </Zoom>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        )}
        {step !== 0 && (
          <p className="self-center items-center justify-center flex flex-row gap-2 text-slate-500 tracking-tighter text-sm ">
            {!media[view] || media[view]?.length <= 0 ? (
              <></>
            ) : (
              <>
                <CgInfo className="w-4 h-4" />

                <span>
                  {media[view]?.length} dosya bulundu. Dosyayı büyütmek için
                  üstüne tıklayın.
                </span>
              </>
            )}
          </p>
        )}
        {action === "edit" && !loading && (
          <div
            className={`lg:w-full w-3/5 self-center flex h-auto mt-2 items-center justify-between lg:flex ${
              state && "absolute bottom-0 right-0  "
            }  gap-2`}
          >
            <Button
              color="success"
              variant={"flat"}
              className="w-full dark h-auto py-2 mx-2 "
              endContent={<PlusIcon />}
              onPress={() => {
                setDocumentAction({
                  type: null,
                  state: "add",
                });
                onOpen();
              }}
            >
              Döküman Ekle
            </Button>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        backdrop="blur"
        className={`dark text-slate-200 ${font.className}`}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        aria-label="Reminder Modal"
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
        {documentAction.state &&
          (documentAction.state === "add" ? (
            <UploadDocuments />
          ) : (
            <RemoveDocuments />
          ))}
      </Modal>
    </>
  );
}
