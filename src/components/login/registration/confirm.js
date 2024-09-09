import React, { useState, useEffect } from "react";
import universitiesdb from "@/lib/universitiesdb";
import "@/styles/loading.module.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ScrollShadow,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/stores/slices/stepSlice";
import { Steps } from "../ui/steps";
import idGenerator from "@/utils/assistants/idGenerator";
import registerStudent from "@/utils/db/registerStudent";
import { setUserData } from "@/stores/slices/authSlice";
import { setLoading } from "@/stores/slices/loadingSlice";

export const Confirm = () => {
  const dispatch = useDispatch();
  const { email, name, surname, city, university, university_program } =
    useSelector((state) => state.auth);
  const { no, auth } = useSelector((state) => state.step);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const student = useSelector((state) => state.auth);

  useEffect(() => {
    if (isConfirmed) {
      const findUni = universitiesdb[university - 1]?.name;

      if (findUni) {
        dispatch(
          setUserData({
            id: idGenerator(7, "number"),
            name,
            surname,
            email,
            city,
            university_program,
            university: findUni,
          })
        );
      }
    }
  }, [isConfirmed]);

  const confirmRegistration = async () => {
    setIsConfirmed(true);
    dispatch(
      setLoading({
        loading: true,
      })
    );

    const updatedStudent = {
      ...student,
      id: idGenerator(7, "number"),
      university: universitiesdb[student.university - 1]?.name,
    };

    await registerStudent(updatedStudent, dispatch);

    setTimeout(() => {
      setShowTable(false);
      setTimeout(() => {
        setIsConfirmed(false);
        dispatch(
          setLoading({
            loading: false,
          })
        );

        dispatch(
          setStep({
            auth,
            no: no + 1,
          })
        );
      }, 500);
    }, 1500);
  };

  return (
    <ScrollShadow className="h-[50vh] w-full overflow-y-scroll items-center justify-center">
      <center>
        <Steps />
      </center>
      <div className="mt-4 w-full h-auto">
        <Table aria-label="Register Information" className={`dark w-full`}>
          <TableHeader className="text-white">
            <TableColumn>Email</TableColumn>
            <TableColumn>İsim</TableColumn>
            <TableColumn>Soyisim</TableColumn>
            <TableColumn>Şehir</TableColumn>
            <TableColumn>Üniversite</TableColumn>
            <TableColumn>Bölüm</TableColumn>
          </TableHeader>
          <TableBody className="text-white">
            <TableRow className="">
              <TableCell className="table-cell min-w-min">{email}</TableCell>
              <TableCell className="table-cell min-w-min">{name}</TableCell>
              <TableCell className="table-cell min-w-min">{surname}</TableCell>
              <TableCell className="table-cell min-w-min">{city}</TableCell>
              <TableCell className="table-cell min-w-min">
                {universitiesdb[university - 1]?.name}
              </TableCell>
              <TableCell>{university_program}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          color="danger"
          className="dark w-full h-auto py-4 mt-2 font-extrabold tracking-wide text-lg hover:bg-green-500"
          onClick={() => {
            confirmRegistration();
          }}
        >
          {isConfirmed ? <span className="loader"></span> : "ONAYLIYORUM"}
        </Button>
      </div>
    </ScrollShadow>
  );
};
