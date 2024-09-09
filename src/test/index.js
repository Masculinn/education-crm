import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Button, Divider, Input } from "@nextui-org/react";
import idGenerator from "@/utils/assistants/idGenerator";
import addStudents from "@/utils/db/addStudents";
import viewStudents from "@/utils/db/viewStudents";

const inter = Inter({ subsets: ["latin"] });

export default function Test() {
  const [student, setStudent] = useState({
    id: "",
    name: "",
    program: "",
    age: "",
    university: "",
    status: "",
    city: "",
    phone: "",
    address: "",
    avatar: "",
    email: "",
  });
  const [viewStudentTable, setViewStudentTable] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      const students = await viewStudents();
      setViewStudentTable(students);
    };

    fetchStudents();
  }, []);


  const handleSubmit = async () => {
    const newStudent = {
      ...student,
      id: idGenerator(7, "number"),
    };

    const checkEmpty = Object.values(newStudent).every((val) => val !== "");

    if (checkEmpty) {
      console.log(JSON.stringify(newStudent));
      await addStudents(newStudent);
      const updatedStudents = await viewStudents();
      setViewStudentTable(updatedStudents);
      setStudent({
        id: "",
        name: "",
        program: "",
        age: "",
        university: "",
        status: "",
        city: "",
        phone: "",
        address: "",
        avatar: "",
        email: "",
      });
    } else {
    
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} bg-black`}
    >
      <div className="container mx-auto ">
        <div className="container mx-auto bg-slate-950/50 rounded-lg min-h-screen h-screen items-center justify-center flex flex-row gap-4">
          <div className="w-1/2 h-screen">
            <h2 className="text-white font-extrabold tracking-tighter text-4xl mb-4">
              Add Student
            </h2>
            <Divider orientation="horizontal" />
            <aside className="w-full h-auto items-center justify-center flex flex-col gap-1">
              {Object.entries(student).map(([key, val], idx) => {
                if (key !== "id") {
                  return (
                    <Input
                      key={idx}
                      type="text"
                      label={key.toUpperCase()}
                      value={val}
                      variant="bordered"
                      className="dark"
                      color="default"
                      onChange={(e) => {
                        setStudent((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }));
                      }}
                    />
                  );
                }
                else {
                  <p key={idx}>{key}</p>
                }
              })}
              <Button
                className="dark w-full"
                color="success"
                variant="faded"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </aside>
          </div>
          <div className="w-1/2 h-full">
            <h1 className="text-4xl font-bold text-white">Students</h1>
            <ul className="items-start justify-start flex flex-col w-auto h-auto">
          {viewStudentTable?.map((val, idx) => (
            <li key={idx} className="bg-transparent p-4 rounded-md shadow-md text-white">
              <h2 className="text-xl font-semibold">{val.name}</h2>
              <p className="text-gray-600">{val.university}</p>
            </li>
          ))}
        </ul>

          </div>
        </div>
       
      </div>
    </main>
  );
}
