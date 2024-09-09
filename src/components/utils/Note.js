import { useSpring, animated } from "@react-spring/web";
import { Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import deleteStudentNote from "@/utils/db/deleteStudentNote";
import alertModal from "@/utils/assistants/alertModal";
import { useDispatch, useSelector } from "react-redux";
import deleteAdminNote from "@/utils/db/adminQueries/deleteAdminNote";

export const Note = ({ author, note, date, id, removeNote, avatar }) => {
  const [isNew, setIsNew] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { auth, name } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNew) {
      setIsNew(false);
    }
  }, []);

  const anim = useSpring({
    from: isNew
      ? {
          opacity: 0,
          transform: "translateX(-40px) scale(0.9) rotate(-10deg)",
        }
      : {},
    to: {
      opacity: 1,
      transform: "translateX(0) scale(1) rotate(0deg)",
    },
    config: { mass: 1, tension: 280, friction: 12 },
  });

  const handleDelete = async () => {
    console.log("Attempting to delete note with ID:", id);
    // Optimistically update UI
    removeNote(id);

    try {
      let res;
      if (auth === "admin") {
        res = await deleteAdminNote(id, dispatch);
      } else if (auth === "student") {
        res = await deleteStudentNote(id, dispatch);
      }

      if (res.success) {
        console.log("Note deleted successfully");
        alertModal({
          toastIcon: "success",
          toastTitle: `Notunuz silindi`,
        });
      } else {
        console.error("Delete failed with error:", res.error);
        alertModal({
          toastIcon: "error",
          toastTitle: `Not silinemedi: ${res.error.message || res.error}`,
        });
        // Revert UI update if deletion failed
        removeNote((prevNotes) => [
          ...prevNotes,
          { author, note, date, id, avatar },
        ]);
      }
    } catch (error) {
      console.error("Unexpected error occurred during note deletion:", error);
      alertModal({
        toastIcon: "error",
        toastTitle: `Not silinemedi: ${error.message || error}`,
      });
      // Revert UI update if unexpected error occurs
      removeNote((prevNotes) => [
        ...prevNotes,
        { author, note, date, id, avatar },
      ]);
    }
  };

  return (
    <animated.li
      style={anim}
      className="px-3 py-2 w-full text-start text-white items-start gap-1 bg-slate-800 rounded-xl justify-start flex flex-col text-sm"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Avatar
            radius="full"
            name={author}
            alt={author}
            src={avatar && avatar}
            height={50}
            width={50}
          />
        </div>
        <div className="flex flex-col">
          <p className={` ${note.length > 100 ? "text-xs" : "text-sm"}`}>
            {note}
          </p>
          <div className="mt-1 items-center justify-start flex flex-row gap-1">
            <span className="text-green-500 text-xs ">{date}</span>
            {auth === "admin" ? (
              <>
                {name === author && isHovered && (
                  <button
                    aria-label="Deleting Note"
                    className="w-auto h-auto flex items-center justify-center"
                    onClick={handleDelete}
                  >
                    <DeleteIcon className={"text-danger-500 w-4 h-4"} />
                  </button>
                )}
              </>
            ) : (
              <>
                {isHovered && (
                  <button
                    aria-label="Deleting Note"
                    className="w-auto h-auto flex items-center justify-center"
                    onClick={handleDelete}
                  >
                    <DeleteIcon className={"text-danger-500 w-4 h-4"} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </animated.li>
  );
};
