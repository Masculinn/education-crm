import { useState, useEffect, useRef } from "react";
import { Button, Textarea, Input } from "@nextui-org/react";
import { CgDanger } from "react-icons/cg";
import { GiConfirmed } from "react-icons/gi";
import { getDate } from "@/utils/assistants/getDate";
import { SearchIcon } from "../icons/SearchIcon";
import { BiSolidMessageRoundedError } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import idGenerator from "@/utils/assistants/idGenerator";
import { Note } from "../utils/Note";
import addStudentNote from "@/utils/db/addStudentNote";
import viewStudentNotes from "@/utils/db/viewStudentNotes";
import addAdminNote from "@/utils/db/adminQueries/addAdminNote";
import viewAdminNotes from "@/utils/db/adminQueries/viewAdminNotes";
import { LoadingSkeleton } from "../loading/LoadingSkeleton";

export const MyNotes = () => {
  const {
    avatar,
    name,
    id: authorID,
    auth,
  } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    id: "",
    note: "",
    author: name,
    date: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [errorLog, setErrorLog] = useState(undefined);

  useEffect(() => {
    const getNotes = async () => {
      setLoading(true);
      if (auth === "student") {
        const fetchedNotes = await viewStudentNotes(authorID).finally(() => {
          setLoading(false);
        });
        setNotes(fetchedNotes);
      } else if (auth === "admin") {
        const fetchedNotes = await viewAdminNotes().finally(() => {
          setLoading(false);
        });
        setNotes(fetchedNotes);
      }
    };

    getNotes();
  }, [auth, dispatch, authorID]);

  const clearNote = () => {
    setNote((prev) => ({
      ...prev,
      date: null,
      note: "",
    }));
  };

  const addNote = async () => {
    if (note.note.trim() !== "" && note.note.length >= 12) {
      const generatedID = idGenerator(12, "number");
      setNotes((prev) => [{ ...note, id: generatedID }, ...prev]);
      if (auth === "admin") {
        await addAdminNote({
          id: generatedID,
          author: name,
          note: note.note,
          date: getDate(),
          avatar: avatar,
        });
        clearNote();
        setErrorLog(null);
      } else if (auth === "student") {
        await addStudentNote({
          id: generatedID,
          authorID: authorID,
          author: name,
          note: note.note,
          date: getDate(),
        });
        clearNote();
        setErrorLog(null);
      }
    } else if (note.note.trim() === "") {
      setErrorLog("Yukarısı boş bırakılmamalıdır.");
    } else if (note.note.length <= 12) {
      setErrorLog("Notunuz 12 karakterden uzun olmalıdır.");
    }
  };

  const removeNote = (id) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((note) => note.id !== id);
      return updatedNotes;
    });
  };

  useEffect(() => {
    if (Array.isArray(notes)) {
      const filtered = notes.filter((val) =>
        val.note.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const sortedNotes = filteredNotes.sort((a, b) => {
    const [dateA, timeA] = a.date.split(" - ");
    const [dateB, timeB] = b.date.split(" - ");

    const [monthA, dayA, yearA] = dateA.split("/");
    const [monthB, dayB, yearB] = dateB.split("/");

    const dateTimeA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);
    const dateTimeB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

    return dateTimeB - dateTimeA;
  });

  return (
    <>
      <div className="flex w-full items-start flex-col justify-between gap-4 h-auto">
        <div ref={listRef} />
        <h2 className="self-start flex font-extrabold text-3xl">
          {auth === "admin" ? "Pano" : "Notlarım"}
        </h2>
        <Input
          color="primary"
          placeholder="Notunuzu arayın..."
          variant="bordered"
          isClearable
          onClear={() => {
            setSearchQuery("");
          }}
          className="dark text-white"
          classNames={{
            innerWrapper: "text-white",
          }}
          startContent={<SearchIcon />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div
        className={`w-full h-auto bg-transparent rounded-2xl justify-center text-center items-center text-white flex flex-col gap-8`}
      >
        <ul className="items-start w-full h-96 flex rounded-2xl justify-start flex-col gap-2 text-start tracking-tighter overflow-y-scroll overflow-hidden">
          {loading ? (
            Array.from({ length: 7 }).map((_, index) => (
              <LoadingSkeleton
                isWidthFull
                textLine={2}
                mode={"label"}
                key={index}
              />
            ))
          ) : sortedNotes.length > 0 ? (
            sortedNotes.map((val) =>
              auth === "student" ? (
                <Note
                  key={val.id}
                  avatar={avatar}
                  {...val}
                  removeNote={removeNote}
                />
              ) : (
                <Note key={val.id} removeNote={removeNote} {...val} />
              )
            )
          ) : (
            <li className=" w-full font-extrabold text-center h-full text-white items-center rounded-xl text-sm self-center justify-center flex lg:flex-row flex-col gap-2">
              <BiSolidMessageRoundedError className="w-8 h-8" />
              <span className="text-xl">Oops, Notunuz Bulunamadı</span>
            </li>
          )}
        </ul>

        <div className="w-full h-auto items-start justify-center flex flex-col gap-3 rounded-xl">
          <Textarea
            className="dark font-sans"
            maxLength={1024}
            placeholder="Lütfen notunuzu buraya yazın..."
            value={note.note}
            label="Not Ekle"
            color="success"
            labelPlacement="inside"
            classNames={{ label: "text-xl font-extrabold text-white text" }}
            variant="bordered"
            onChange={(e) => {
              setNote((prev) => ({
                ...prev,
                note: e.target.value,
                date: getDate(),
              }));
            }}
          />
          <div className="items-center justify-center flex flex-row gap-2 w-full">
            <Button
              color="danger"
              variant="solid"
              className="w-1/2 dark h-auto py-2 px-4 tracking-tighter font-semibold text-white transition duration-200"
              onPress={clearNote}
            >
              Temizle
            </Button>
            <Button
              color="success"
              variant="solid"
              className="w-1/2 dark h-auto py-2 px-4 tracking-tighter font-semibold text-white transition duration-200"
              onPress={addNote}
              disabled={loading}
            >
              {loading ? "Notunuz Yükleniyor" : "Notu Ekle"}
            </Button>
          </div>
          {errorLog !== null && errorLog !== undefined ? (
            <p className="text-xs text-amber-200 items-center justify-center flex gap-2 flex-row self-start text-start">
              <CgDanger className="w-6 h-6" />
              <span>{errorLog}</span>
            </p>
          ) : (
            errorLog !== undefined && (
              <p className="text-xs text-green-400 items-center justify-center flex gap-2 flex-row self-start text-start">
                <GiConfirmed className="w-6 h-6" />
                <span>Not başarıyla eklendi</span>
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
};
