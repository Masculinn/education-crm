import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import universitiesdb from "@/lib/universitiesdb";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/stores/slices/authSlice";
import { setStep } from "@/stores/slices/stepSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Steps } from "../ui/steps";
import {
  Button,
  ScrollShadow,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { CgDanger } from "react-icons/cg";

const UniversityActions = () => {
  const dispatch = useDispatch();
  const { email, name, surname, city, university_program } = useSelector(
    (state) => state.auth
  );
  const { no, auth } = useSelector((state) => state.step);
  const [uniNumber, setUniNumber] = useState(0);

  useEffect(() => {
    dispatch(
      setUserData({
        email,
        name,
        surname,
        city,
        university: uniNumber,
        university_program,
      })
    );
    dispatch(
      setStep({
        auth,
        no: uniNumber !== 0 ? 4 : no,
      })
    );
  }, [uniNumber]);

  const UniLayer = ({ name, city, desc, idx }) => {
    return (
      <div className="w-full relative h-full bg-transparent items-center justify-center flex flex-col  tracking-tight">
        <div className="w-full min-h-max h-auto absolute  bottom-0 px-8 py-4 items-start justify-start flex flex-col gap-2 bg-black/50">
          <h2 className="text-xl text-white">{name}</h2>
          <h3 className="text-slate-300">{city}</h3>
          <p className="text-sm text-white">{desc}</p>
        </div>
        <Button
          className=" dark px-8 absolute top-4 right-4"
          color="danger"
          variant="solid"
          style={{ zIndex: 999 }}
          onPress={() => {
            setUniNumber(idx + 1);
          }}
          endContent={<FaArrowRightLong className="w-4 h-4" />}
        >
          SEÇ
        </Button>
      </div>
    );
  };

  return (
    <ScrollShadow className="h-[50vh] w-full overflow-y-scroll  items-center justify-center">
      <center>
        <Steps />
      </center>
      <div className="h-72 items-center justify-center w-full relative rounded-2xl mt-8">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          keyboard={{
            enabled: true,
          }}
          modules={[Navigation]}
          navigation={{
            enabled: true,
          }}
          effect="slide"
          className="h-full w-full  rounded-2xl"
          wrapperClass="swiper-navigation"
        >
          {universitiesdb?.map((val, idx) => (
            <SwiperSlide
              key={idx}
              className="bg-cover bg-center w-full h-full"
              style={{ backgroundImage: `url(${val.img})` }}
            >
              <UniLayer {...val} idx={idx} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </ScrollShadow>
  );
};

const ProgramActions = () => {
  const { email, name, surname, city, university } = useSelector(
    (state) => state.auth
  );
  const { no, auth } = useSelector((state) => state.step);
  const dispatch = useDispatch();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [errorLog, setErrorLog] = useState(false);

  const handleProgramSelection = (program) => {
    setSelectedProgram(program);
  };

  const handleClick = () => {
    if (selectedProgram) {
      dispatch(
        setUserData({
          email,
          name,
          surname,
          city,
          university,
          university_program: selectedProgram,
        })
      );
      dispatch(
        setStep({
          auth,
          no: no + 1,
        })
      );
    } else setErrorLog(true);
  };
  return (
    <ScrollShadow className="h-[50vh] w-full overflow-y-scroll items-center justify-center">
      <center>
        <Steps />
      </center>
      <div className="w-full h-auto bg-transparent mt-4 text-white">
        <Table
          aria-label="Register Information"
          className={`dark min-w-min max-h-80 overflow-y-scroll w-full relative`}
        >
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableColumn>ID</TableColumn>
            <TableColumn>Bölüm Adı</TableColumn>
            <TableColumn>Seç</TableColumn>
          </TableHeader>
          <TableBody>
            {universitiesdb[university - 1].all_programs.map((val, idx) => (
              <TableRow key={idx}>
                <TableCell className="table-cell min-w-min">
                  {idx + 1}
                </TableCell>
                <TableCell className="table-cell min-w-min">{val}</TableCell>
                <TableCell className="table-cell min-w-min">
                  <input
                    type="checkbox"
                    checked={selectedProgram === val}
                    className="dark cursor-pointer appearance-none enabled:hover:border-rose-500 disabled:opacity-75 border border-white w-4 h-4 rounded-md checked:bg-rose-500 checked:border-rose-500"
                    onChange={() => handleProgramSelection(val)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {errorLog && (
          <p className="text-xs text-amber-200 items-center justify-start flex gap-2 flex-row self-start text-start pt-2">
            <CgDanger className="w-6 h-6" />
            <span>Lütfen bir program seçin.</span>
          </p>
        )}

        <Button
          color="success"
          variant="flat"
          onClick={handleClick}
          className={`dark px-8 mt-2 tracking-tight`}
        >
          Bölümü Seç
        </Button>
      </div>
    </ScrollShadow>
  );
};

export { UniversityActions, ProgramActions };
