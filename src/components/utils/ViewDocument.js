import { Button, Image } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination } from "swiper/modules";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "swiper/css";
import "swiper/css/pagination";

export const ViewDocument = ({
  documents,
  header,
  isEditable,
  isDeleteable,
  isDownloadable,
}) => {
  return (
    <div
      className={`w-1/3 h-auto items-center justify-center text-start flex flex-col gap-3 bg-slate-950 rounded-2xl p-4`}
    >
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        keyboard={{
          enabled: true,
        }}
        modules={[SwiperPagination]}
        pagination={{
          clickable: true,
        }}
        effect="slide"
        className="w-full h-auto  rounded-2xl"
      >
        {documents?.map((val, idx) => (
          <SwiperSlide key={idx} className="w-full h-full">
            <div
              className={` w-full relative h-full bg-transparent items-center justify-center flex flex-col  tracking-tight`}
            >
              <Zoom zoomMargin={24}>
                <Image
                  width={300}
                  alt="Belge Resmi"
                  src={val}
                  className="object-cover object-center cursor-pointer"
                />
              </Zoom>
              <div className="w-auto h-auto absolute py-2 top-0 right-0 px-4 rounded-xl z-50 bg-black/50 backdrop-blur-md   items-start justify-start flex flex-col">
                <h2 className="text-md ">{header}</h2>
                <div className="w-full h-auto items-end justify-end flex flex-row gap-1 mt-2">
                  {isEditable && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="warning"
                      className="text-white"
                    >
                      Editle
                    </Button>
                  )}
                  {isDeleteable && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      className=""
                    >
                      Sil
                    </Button>
                  )}
                  {isDownloadable && (
                    <Button
                      size="sm"
                      type="button"
                      variant="solid"
                      color="success"
                      className="text-white"
                    >
                      <a
                        href={val}
                        download={true}
                        className="w-full h-full items-center justify-center flex"
                      >
                        Indir
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
